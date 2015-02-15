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

    if (util.isSassFile(filename)) {
      dep = resolveSassDepPath(dep, filename, directory);

    } else {
      dep = resolveDepPath(dep, filename, directory);
    }

    dependents[dep] = dependents[dep] || {};
    // The current file is a dependent of the dependency
    dependents[dep][filename] = 1;
  });
};

/**
 * Determines the resolved dependency path according to
 * the Sass compiler's dependency lookup behavior
 *
 * @param  {String} dep
 * @param  {String} filename
 * @param  {String} directory
 * @return {String}
 */
function resolveSassDepPath(dep, filename, directory) {
  var fileDir = path.dirname(filename);
  // Use the file's extension if necessary
  var ext = path.extname(dep) ? '' : path.extname(filename);
  var sassDep;

  if (dep.indexOf('..') === 0 || dep.indexOf('.') === 0) {
    sassDep = path.resolve(filename, dep) + ext;

    if (fs.existsSync(sassDep)) { return sassDep; }
  }

  // path.basename in case the dep is slashed: a/b/c should be a/b/_c.scss
  var isSlashed = dep.indexOf('/') !== -1;
  var _dep = isSlashed ?
            path.dirname(dep) + '/_' + path.basename(dep) :
            '_' + dep;

  var underscored = path.resolve(fileDir, _dep) + ext;

  if (fs.existsSync(underscored)) { return underscored; }

  var samedir = path.resolve(fileDir, dep) + ext;

  if (fs.existsSync(samedir)) { return samedir; }

  return path.resolve(directory, dep) + ext;
}

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