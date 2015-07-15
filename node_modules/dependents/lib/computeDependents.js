var precinct = require('precinct');
var util = require('./util');
var debug = require('debug')('dependents');

var lookup = require('module-lookup-amd');
var resolveDepPath = require('resolve-dependency-path');
var sassLookup = require('sass-lookup');
var stylusLookup = require('stylus-lookup');

/**
 * Registers all dependencies of the given file as "used"
 *
 * @param {Object} options
 * @param {String} options.filename
 * @param {String} options.directory
 * @param {String} [options.config] - path to a requirejs config file
 * @return {Object}
 */
module.exports = function(options) {
  var filename = options.filename;
  var directory = options.directory;
  var config = options.config;
  var dependents = {};

  dependents[filename] = {};

  // Register the current file as dependent on each dependency
  var dependencies = getDependencies(filename);

  debug('' + dependencies.length + ' dependencies for ' + filename.replace(directory, ''));

  dependencies.forEach(function(dep) {
    // Look up the dep to see if it's aliased in the config
    // TODO: Generate a precinct-like lookup factory
    if (config && util.isJSFile(filename)) {
      debug('pre-lookup path: ' + dep);
      dep = lookup(config, dep, filename);
      debug('post-lookup path: ' + dep);
    }

    // TODO: Possibly a switch statement about the file extensions
    if (util.isSassFile(filename)) {
      dep = sassLookup(dep, filename, directory);

    } else if (util.isStylusFile(filename)) {
      dep = stylusLookup(dep, filename, directory);

    } else {
      debug('pre path resolution: ' + dep);
      dep = resolveDepPath(dep, filename, directory);
      debug('post path resolution: ' + dep);
    }

    dependents[dep] = dependents[dep] || {};
    // The current file is a dependent of the dependency
    dependents[dep][filename] = 1;
  });

  return dependents;
};

/**
 * @param  {String} filename
 * @return {String[]}
 */
function getDependencies(filename) {
  try {
    return precinct.paperwork(filename);
  } catch (e) {
    return [];
  }
}
