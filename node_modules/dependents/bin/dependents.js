#!/usr/bin/env node

'use strict';

var dependents = require('../'),
    getJSFiles = require('../lib/getJSFiles'),
    filename   = process.argv[2],
    directory  = process.argv[3],
    config     = process.argv[4],
    cluster    = require('cluster'),
    q          = require('q');

/**
 * Uniquely aggregates the dependents across forks (if used).
 * This being an object allows us to avoid duplicate dependents.
 *
 * @type {Object}
 */
var _dependents = {};

/**
 * Minimum Number of files needed to require clustering
 *
 * @type {Number}
 */
var threshold = 500;

/**
 * The approximate number of times a worker should come back for more files to process.
 * Empirically set.
 * @type {Number}
 */
var numTripsPerWorker = 5;

/**
 * Forks separate node processes to find dependents for the filename in parallel
 *
 * @param  {String}   filename  - File to find the dependents for
 * @param  {Array}    files     - List of JS files to process
 * @param  {Function} cb        - Executed with String[] of dependent filenames
 */
function spawnWorkers(filename, files, cb) {
  var numCPUs = require('os').cpus().length,
      numFiles = files.length,
      // We don't care to overshoot the number of files, slice will correct this
      chunkSize = Math.ceil(numFiles / numCPUs / numTripsPerWorker),
      numFilesProcessed = 0,
      worker;

  for (var i = 0; i < numCPUs; i++) {
    worker = cluster.fork();
  }

  q.all(Object.keys(cluster.workers).map(function(id, idx) {
    var worker = cluster.workers[id],
        deferred = q.defer(),
        delegateWork = function(worker) {
          var _files = getMoreFiles(files, chunkSize);

          if (! _files.length) {
            deferred.resolve();
            worker.kill();
            return;
          }

          worker.send({
            filename: filename,
            files: _files
          });

          numFilesProcessed += _files.length;
        };

    delegateWork(worker);

    worker.on('message', function(deps) {
      deps.forEach(function(depFilename) {
        _dependents[depFilename] = 1;
      });

      delegateWork(worker);
    });

    return deferred.promise;
  }))
  .done(function() {
    if (numFilesProcessed !== numFiles) throw new Error('missed some files');

    cb(Object.keys(_dependents));
  });
}

/**
 * @param  {String[]} files     [description]
 * @param  {Number} chunkSize
 * @return {String[]}
 */
function getMoreFiles(files, chunkSize) {
  if (typeof getMoreFiles.tripNum === 'undefined') getMoreFiles.tripNum = 0;

  var _files = files.slice(getMoreFiles.tripNum * chunkSize, (getMoreFiles.tripNum + 1) * chunkSize);

  getMoreFiles.tripNum++;

  return _files;
}

/** @param {Array} dependents */
function printDependents(dependents) {
  dependents.forEach(function(dependent) {
    console.log(dependent);
  });
}

if (cluster.isMaster) {
  var filesCb = function(files) {
    if (files.length >= threshold) {
      spawnWorkers(filename, files, printDependents);

    } else {
      dependents.for({
        filename:  filename,
        directory: directory,
        files:     files,
        config:    config,
        success:   printDependents
      });
    }
  };

  getJSFiles({
    directory: directory,
    filesCb: filesCb
  });
}

if (cluster.isWorker) {
  process.on('message', function(args) {
    var filename  = args.filename,
        files     = args.files;

    dependents.for({
      filename:   filename,
      directory:  directory,
      files:      files,
      config:     config,
      success: function(deps) {
        process.send(deps);
      }
    });
  });
}
