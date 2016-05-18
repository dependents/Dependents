var cabinet = require('filing-cabinet');
var Config = require('./Config');
var q = require('q');
var path = require('path');
var debug = require('debug')('backend');
var find = require('find');
var fileExists = require('file-exists');

module.exports = function(program) {
  var deferred = q.defer();

  debug('given values', program);

  var config;
  try {
    config = new Config();
    config.findAndLoad(path.dirname(program.filename));
    debug('loaded config', config);

  } catch (e) {
    deferred.reject(e.message);
  }

  var options = {
    directory: config.directory,
    filename: program.filename,
    excludes: config.excludes,
    config: config.requireConfig,
    webpackConfig: config.webpackConfig,
    target: program.args[0]
  };

  debug('command options', options);

  if (program.lookup) {
    options.target = options.target.replace(/["|'|;]/g, '');
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
