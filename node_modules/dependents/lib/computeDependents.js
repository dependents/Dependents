var precinct = require('precinct');
var debug = require('debug')('dependents');
var cabinet = require('filing-cabinet');

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
  var webpackConfig = options.webpackConfig;
  var dependents = {};

  dependents[filename] = {};

  // Register the current file as dependent on each dependency
  var data = getDependencies(filename);

  debug('' + data.dependencies.length + ' dependencies for ' + filename.replace(new RegExp(directory + '/?'), ''));

  data.dependencies.forEach(function(dep) {
    debug('before cabinet lookup: ' + dep);

    var result = cabinet({
      partial: dep,
      ast: data.ast,
      filename: filename,
      directory: directory,
      config: config,
      configPath: options.configPath,
      webpackConfig: webpackConfig
    });

    debug('after cabinet lookup: ' + result);

    if (result) {
      dep = result;
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
  var result = {
    ast: null,
    dependencies: [],
  };

  try {
    result.dependencies = precinct.paperwork(filename, {
      includeCore: false
    });

    result.ast = precinct.ast;

    return result;
  } catch (e) {
    return result;
  }
}
