var precinct = require('precinct');
var util = require('./util');
var lookup = require('module-lookup-amd');
var resolveDepPath = require('resolve-dependency-path');
var fs = require('fs');
var path = require('path');

/**
 * Registers all dependencies of the given file as "used"
 *
 * @param {Object} options
 * @param {String} options.filename
 * @param {String} options.content
 * @param {String} options.directory
 * @param {String} [options.config] - path to a requirejs config file
 * @param {Object} options.dependents - hash of dependents found so far
 */
module.exports = function(options) {
  var filename = options.filename;
  var fileContent = options.content;
  var directory = options.directory;
  var dependents = options.dependents;

  if (!fileContent) { return; }

  dependents[filename] = dependents[filename] || {};

  // Register the current file as dependent on each dependency
  getDependencies(filename, fileContent).forEach(function(dep) {
    // Look up the dep to see if it's aliased in the config
    if (options.config && !util.isSassFile(filename)) {
      dep = lookup(options.config, dep);
    }

    dep = resolveDepPath(dep, filename, directory);

    // In sass, @import "foo" can resolve to foo.scss or _foo.scss
    if (util.isSassFile(dep) && !fs.existsSync(dep) && path.basename(dep)[0] !== '_') {
      var underscored = getUnderscoredSassPath(dep);

      if (! fs.existsSync(underscored)) {
        return;
      }

      dep = underscored;
    }

    dependents[dep] = dependents[dep] || {};
    // The current file is a dependent of the dependency
    dependents[dep][filename] = 1;
  });
};

/**
 * Returns an underscored version of the given dependency's file path
 *
 * @param  {String} dep
 * @return {String}
 */
function getUnderscoredSassPath(dep) {
  var ext = path.extname(dep);
  var filename = path.basename(dep, ext);
  var dirname = path.dirname(dep);

  return dirname + '/_' + filename + ext;
}

/**
 * @param  {String} filename
 * @param  {String} fileContent
 * @return {String[]}
 */
function getDependencies(filename, fileContent) {
  var dependencies = [];

  try {
    if (util.isSassFile(filename)) {
      dependencies = precinct(fileContent, 'sass');
    } else {
      dependencies = precinct(fileContent);
    }
  } catch (e) {
    return [];
  }

  return dependencies;
}