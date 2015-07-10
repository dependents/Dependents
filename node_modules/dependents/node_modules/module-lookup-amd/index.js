var ConfigFile = require('requirejs-config-file').ConfigFile;
var path = require('path');
var normalize = require('./lib/normalize');

/**
 * Determines the real path of a potentially aliased dependency path
 * via the paths section of a require config
 *
 * @param  {String|Object} config - Pass a loaded config object if you'd like to avoid rereading the config
 * @param  {String} depPath - the dependency name
 * @param  {String} filepath - the file containing the dependency
 *
 * @return {String}
 */
module.exports = function(config, depPath, filepath) {
  var configPath;

  if (typeof config === 'string') {
    configPath = path.dirname(config);
    config = module.exports._readConfig(config);
  }

  if (!config.baseUrl) {
    config.baseUrl = configPath || './';
  }

  if (config.baseUrl[config.baseUrl.length - 1] !== '/') {
    config.baseUrl = config.baseUrl + '/';
  }

  // Uses a plugin loader
  var exclamationLocation;
  if ((exclamationLocation = depPath.indexOf('!')) !== -1) {
    depPath = depPath.slice(exclamationLocation + 1);
  }

  var normalized = normalize(depPath, filepath || '', config);

  var filepathWithoutBase = filepath.split(config.baseUrl)[0];

  normalized = path.join(filepathWithoutBase, normalized);

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
