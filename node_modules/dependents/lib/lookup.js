var ConfigFile = require('requirejs-config-file').ConfigFile,
    path = require('path');

/**
 * Determines the real path of a potentially aliased dependency path
 * via the paths section of a require config
 *
 * @param  {String|Object} config - Pass a loaded config object if you'd like to avoid rereading the config
 * @param  {String} depPath
 * @return {String}
 */
module.exports = function(config, depPath) {
  var configPath;

  if (typeof config === 'string') {
    configPath = path.dirname(config);
    config = new ConfigFile(config).read();
  }

  var baseUrl = configPath || config.baseUrl,
      pathTokens = depPath.split('/'),
      topLevelDir = pathTokens[0],
      exclamationLocation, alias;

  // Uses a plugin loader
  if ((exclamationLocation = topLevelDir.indexOf('!')) !== -1) {
    topLevelDir = topLevelDir.slice(exclamationLocation + 1);
  }

  // Check if the top-most dir of path is an alias
  alias = config.paths[topLevelDir];

  if (alias) {
    // Handle alias values that are relative paths (about the baseUrl)
    if (alias.indexOf('..') === 0 && baseUrl) {
      // Get the resolved path of the baseURL from the depPath
      configPath = configPath || depPath.slice(0, depPath.indexOf(baseUrl) + baseUrl.length);

      alias = path.resolve(configPath, alias);
    }

    alias = alias[alias.length - 1] === '/' ? alias : alias + '/';

    depPath = alias + pathTokens.slice(1).join('/');
  }

  // Normalize trailing slash
  depPath = depPath[depPath.length - 1] === '/' ? depPath.slice(0, -1) : depPath;

  return depPath;
};
