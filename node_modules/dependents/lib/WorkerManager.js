var os = require('os');
var q = require('q');
var extend = require('extend');
var fork = require('child_process').fork;
var debug = require('debug')('dependents');

module.exports = function(options) {
  this.directory = options.directory;
  this.config = options.config;
  this.configPath = options.configPath;
  this.files = options.files;
  this.webpackConfig = options.webpackConfig;

  /**
   * The approximate number of times a worker should come back for more files to process.
   *
   * Empirically set.
   * @type {Number}
   */
  this.numTripsPerWorker = 5;

  this.numCPUs = os.cpus().length;

  /**
   * The maximum size of files a process can be given at a time.
   * This attempts to more evenly distribute the load
   *
   * @type {Number}
   */
  this.chunkSize = Math.ceil(this.files.length / this.numCPUs / this.numTripsPerWorker);

  /**
   * The current chunk of files being distributed
   *
   * @type {Number}
   */
  this.chunkNumber = 0;

  debug('Expected number of chunks: ' + Math.ceil(this.files.length / this.chunkSize));

  this.numberOfFilesProcessed = 0;

  this.dependents = {};
};

module.exports.prototype.computeAllDependents = function() {
  return this._spawnWorkers()
  .then(function() {
    if (!this._processedAllFiles()) {
      var msg = 'failed to process ' + (this.files.length - this.numberOfFilesProcessed) + ' files';
      debug('Only processed ' + this.numberOfFilesProcessed + ' files');
      debug(msg);
      throw new Error(msg);
    }

    debug('Finished computing all dependents', this.dependents);

    return this.dependents;
  }.bind(this));
};

/**
 * @private
 * @return {Boolean}
 */
module.exports.prototype._processedAllFiles = function() {
  return this.numberOfFilesProcessed === this.files.length;
};

/**
 * Forks separate node processes to find dependents for the filename in parallel
 */
module.exports.prototype._spawnWorkers = function() {
  return q.all(this._getWorkers().map(this._assignWork, this));
};

/**
 * @return {Object[]}
 */
module.exports.prototype._getWorkers = function() {
  var workers = [];
  var worker;

  for (var i = 0; i < this.numCPUs; i++) {
    worker = this._createWorker();
    debug('worker ', worker.pid, 'created');
    workers.push(worker);
  }

  return workers;
};

/**
 * Exposed for testing
 *
 * @private
 */
module.exports.prototype._createWorker = function() {
  return fork(__dirname + '/worker.js');
};

/**
 * @param  {Object} worker
 * @return {Promise}
 */
module.exports.prototype._assignWork = function(worker) {
  var deferred = q.defer();

  worker.finishedWorking = deferred;

  this._delegateWork(worker);

  return deferred.promise;
};

module.exports.prototype._delegateWork = function(worker) {
  var files = this._getMoreFiles();

  if (!files.length) {
    worker.finishedWorking.resolve();
    debug('worker ' + worker.pid + ' is done and dead');
    worker.kill();
    return;
  }

  worker.once('message', function(data) {
    if (data.err) {
      debug('worker ' + worker.pid + ' killed due to error: ' + data.err);
      worker.finishedWorking.reject(data.err);
      worker.kill();
      return;
    }

    this.numberOfFilesProcessed += files.length;
    extend(true, this.dependents, data.dependents);

    this._delegateWork(worker);
  }.bind(this));

  worker.send({
    directory: this.directory,
    files: files,
    config: this.config,
    configPath: this.configPath,
    webpackConfig: this.webpackConfig
  });
};

/**
 * Gets the next chunk of files to process
 *
 * @private
 * @return {String[]}
 */
module.exports.prototype._getMoreFiles = function() {
  var start = this.chunkNumber * this.chunkSize;

  var end = (this.chunkNumber + 1) * this.chunkSize;

  this.chunkNumber++;
  var files = this.files.slice(start, end);

  if (files.length) {
    debug('Delegating chunk #' + (this.chunkNumber - 1));
  }
  return files;
};
