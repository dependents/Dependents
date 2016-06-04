var getDriverScripts = require('get-driver-scripts');
var getTreeAsList = require('dependency-tree').toList;
var path = require('path');
var q = require('q');
var debug = require('debug')('taxi');

/**
 * Used to memoize traversal of trees from all available drivers
 * @type {Object}
 */
var cache = {};

/**
 * Gets the driver script(s) that depend on the given module
 *
 * @param {Object}   options
 * @param {String}   options.filename  - The path of the module whose driver script should be found
 * @param {String}   options.directory - The path to all JS files
 * @param {String}   options.config - The path to a requirejs config
 * @param {String}   options.webpackConfig - The path to a webpack config
 * @param {Function} options.success   - (String[]) Executed with the driver scripts that depend on the given file
 */
module.exports = function(options) {
  if (!options.filename) { throw new Error('filename not given'); }
  if (!options.directory) { throw new Error('directory location not given'); }
  if (!options.success) { throw new Error('success callback not given'); }

  debug('given filename: ' + options.filename);
  debug('given directory: ' + options.directory);
  debug('given config: ' + options.config);
  debug('given webpackConfig: ' + options.webpackConfig);

  options.filename = path.resolve(options.filename);

  var success = options.success;

  options.success = function(err, drivers) {
    debug('found the following driver scripts in the codebase: \n' + drivers.join('\n'));

    var relatedDrivers = findRelatedDrivers({
      drivers: drivers,
      filename: options.filename,
      directory: options.directory,
      config: options.config,
      webpackConfig: options.webpackConfig
    });

    if (err) {
      debug('error: ' + err.message);
    }

    debug('related drivers: \n' + relatedDrivers.join('\n'));

    success(err, relatedDrivers);
  };

  getDriverScripts(options);
};

/**
 * Finds the driver scripts from the list that depend on the given
 * file (at some point in the dependency tree)
 *
 * @param  {Object}   options
 * @param  {String[]} options.drivers
 * @param  {String}   options.filename
 * @param  {String}   options.directory
 * @return {Promise}  Resolves with a list of the relevant driver scripts
 */
function findRelatedDrivers(options) {
  var trees = options.drivers.map(function(driver) {
    return getTreeAsList({
      filename: driver,
      root: options.directory,
      config: options.config,
      webpackConfig: options.webpackConfig,
      // On every call, this will be mutated with the final state of the traversal
      visited: cache
    });
  });

  var relatedDrivers = [];

  trees.forEach(function(treeList, idx) {
    debug('looking for ' + options.filename + ' within: \n' + treeList.join('\n'));

    if (treeList.indexOf(options.filename) !== -1) {
      relatedDrivers.push(options.drivers[idx]);
    }
  });

  return relatedDrivers;
}