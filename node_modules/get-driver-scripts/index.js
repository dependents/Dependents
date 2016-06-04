var getModulesToBuild = require('get-modules-to-build');
var appRoots = require('app-root');
var path = require('path');
var debug = require('debug')('get-driver-scripts');

var defaultExclusions = [
  'bower_components',
  'vendor',
  'node_modules'
];

/**
 * @param {Object} options
 * @param {String} options.directory - Location of all JS files
 * @param {Function} options.success - Called with the list of driver scripts
 * @param {String} [options.buildConfig] - RequireJS build config for module-pack listing
 * @param {String} [options.config] - RequireJS config for aliased paths
 * @param {String} [options.webpackConfig] - Webpack config for aliased paths
 * @param {String[]} [options.exclusions] - List of directory names to exclude from the search
 */
module.exports = function(options) {
  if (!options.success) { throw new Error('success callback not given'); }
  if (!options.directory) { throw new Error('directory not given'); }

  options.exclusions = options.exclusions || [];

  debug('directory: ' + options.directory);
  debug('config: ' + options.config);
  debug('webpack config: ' + options.webpackConfig);
  debug('exclusions: ' + options.exclusions);

  if (options.buildConfig) {
    try {
      var drivers = getConfigDrivers(options.directory, options.buildConfig);
      debug('fetched the following drivers from the build config:\n', drivers);
      options.success(null, drivers);

    } catch (e) {
      debug('error fetching drivers from the build config: ' + e.message);
      debug(e.stack);
      options.success(e);
    }

  } else {
    appRoots({
      directory: options.directory,
      config: options.config,
      webpackConfig: options.webpackConfig,
      ignoreDirectories: defaultExclusions.concat(options.exclusions),
      success: function(roots) {
        options.success(null, roots);
      }
    });
  }
};

/**
 * Get the driver scripts from a requirejs configuration file
 *
 * @param  {String} directory
 * @param  {String} configPath
 * @return {String[]}
 */
function getConfigDrivers(directory, configPath) {
  return getModulesToBuild(configPath).map(function(d) {
    var resolved = path.resolve(directory, d);

    if (!path.extname(resolved)) {
      resolved += '.js';
    }

    return resolved;
  });
}