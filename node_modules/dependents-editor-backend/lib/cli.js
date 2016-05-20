var Config = require('./Config');
var getPath = require('./getPath');

var cabinet = require('filing-cabinet');
var findDependents = require('dependents');
var callers = require('callers');

var q = require('q');
var path = require('path');
var debug = require('debug')('backend');
var find = require('find');
var fileExists = require('file-exists');

module.exports = function(program) {
  var deferred = q.defer();

  debug('given program options', program);

  var config;
  try {
    config = new Config();
    config.findAndLoad(path.dirname(program.filename));
    debug('loaded config', config);

  } catch (e) {
    debug('error when searching for deprc file: ' + e.message);
    deferred.reject(e.message);
    return deferred.promise;
  }

  var options = {
    directory: config.directory,
    filename: program.filename,
    exclude: config.exclude,
    config: config.requireConfig,
    webpackConfig: config.webpackConfig
  };

  debug('command options', options);

  if (program.lookup) {
    options.target = program.args[0].replace(/["|'|;]/g, '');
    debug('performing a lookup');
    var result = lookup(options);

    if (!fileExists(result)) {
      var fileDir = path.dirname(result);

      debug('the file ' + result + ' does not exist');
      var extensionlessFilename = path.basename(result, path.extname(result));

      debug('looking for file like ' + extensionlessFilename + ' within ' + fileDir);
      var results = find.fileSync(new RegExp(extensionlessFilename), fileDir);

      debug('found the following matches: ', results.join('\n'));

      // TODO: Find a smarter way of figuring out the match or
      // return all of the files as a result since we don't know which one is valid
      result = results[0];
    }

    debug('lookup result: ' + result);
    deferred.resolve(result);

  } else if (program.findDependents) {
    debug('finding the dependents of the given file: ' + options.filename);

    findDependents(options, function(err, dependents) {
      debug('found the following dependents: ', dependents);
      deferred.resolve(dependents);
    });

  } else if (program.getPath) {
    deferred.resolve(getPath({
      filename: options.filename,
      directory: options.directory,
      stylesDirectory: config.stylesRoot
    }));

  } else if (program.findCallers) {
    options.functionName = program.args[0].replace(/["|'|;]/g, '');

    options.success = function(err, callers) {
      if (err) {
        deferred.reject(err.message || err);
      } else {
        deferred.resolve(callers);
      }
    };

    debug('finding the callers of "' + options.functionName + '" with options: ', options);

    callers(options);
  }

  return deferred.promise;
};

function lookup(options) {
  return cabinet({
    partial: options.target,
    filename: options.filename,
    directory: options.directory,
    config: options.config,
    webpackConfig: options.webpackConfig
  });
};
