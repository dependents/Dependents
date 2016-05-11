var ConfigFile = require('requirejs-config-file').ConfigFile;
var path = require('path');
var normalize = require('./lib/normalize');
var debug = require('debug')('lookup');

/**
 * Determines the real path of a potentially aliased dependency path
 * via the paths section of a require config
 *
 * @param  {Object} options - Pass a loaded config object if you'd like to avoid rereading the config
 * @param  {String|Object} [options.config] - Pass a loaded config object if you'd like to avoid rereading the config
 * @param  {String} options.partial - the dependency name
 * @param  {String} options.filename - the file containing the dependency
 * @param  {String} [options.directory] - location of all files
 *
 * @return {String}
 */
module.exports = function(options) {
  var configPath;
  var config = options.config || {};
  var depPath = options.partial;
  var filepath = options.filename;
  var directory = options.directory;

  debug('given config: ', config);
  debug('given partial: ', depPath);
  debug('given filename: ', filepath);
  debug('given directory: ', directory);

  if (typeof config === 'string') {
    configPath = path.dirname(config);
    config = module.exports._readConfig(config);
    debug('converting given config file to an object');
  }

  if (!config.baseUrl) {
    config.baseUrl = configPath || './';
    debug('no baseUrl found in config. Defaulting to ' + config.baseUrl);
  }

  if (config.baseUrl[config.baseUrl.length - 1] !== '/') {
    config.baseUrl = config.baseUrl + '/';
    debug('normalized the trailing slash');
  }

  debug('baseUrl: ', config.baseUrl);

  var filepathWithoutBase = filepath.split(config.baseUrl)[0];
  debug('filepath without base ' + filepathWithoutBase);

  // Uses a plugin loader
  var exclamationLocation = depPath.indexOf('!');
  if (exclamationLocation !== -1) {
    debug('stripping off the plugin loader');
    depPath = depPath.slice(exclamationLocation + 1);
    debug('depPath is now ' + depPath);
  }

  var normalized = normalize(depPath, filepath, config);
  debug('normalized path is ' + normalized);

  // A file containing the dependency that's not within the baseurl
  // Example: a test file importing the dependency
  if (filepath.indexOf(config.baseUrl) === -1) {
    debug('filepath was not within baseUrl');

    if (!directory) {
      debug('did not know how to resolve the path');
      return '';
    }

    normalized = path.join(directory, normalized);
  } else {
    normalized = path.join(filepathWithoutBase, normalized);
  }

  debug('final normalized path is ' + normalized);

  return normalized;
};

/**
 * Exposed for testing
 *
 * @private
 * @param  {String} configPath
 * @return {Object}
 */
module.exports._readConfig = function(configPath) {
  return new ConfigFile(configPath).read();
};
