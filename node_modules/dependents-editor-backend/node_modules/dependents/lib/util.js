var path = require('path');
var fs = require('fs');

var debug = require('debug')('dependents');

/**
 * @param  {String}  filename
 * @return {Boolean}
 */
module.exports.isSassFile = function(filename) {
  var ext = path.extname(filename);
  return ext === '.scss' || ext === '.sass';
};

/**
 * @param  {String}  filename
 * @return {Boolean}
 */
module.exports.isStylusFile = function(filename) {
  return path.extname(filename) === '.styl';
};

/**
 * @param  {String}  filename
 * @return {Boolean}
 */
module.exports.isJSFile = function(filename) {
  return path.extname(filename) === '.js';
};

/**
 * Separates out the excluded directories and files
 *
 * @param  {String[]} excludes
 * @param  {String} directory - Used for resolving the exclusion to the filesystem
 *
 * @return {Object} results
 * @return {String} results.directoriesPattern - regex representing the directories
 * @return {String[]} results.directories
 * @return {String} results.filesPattern - regex representing the files
 * @return {String[]} results.files
 */
module.exports.processExcludes = function(excludes, directory) {
  var results = {
    directories: [],
    directoriesPattern: '',
    files: [],
    filesPattern: ''
  };

  if (!excludes) { return results; }

  var dirs = [];
  var files = [];

  excludes.forEach(function(exclude) {
    // Globbing breaks with excludes like foo/bar
    if (this.stripTrailingSlash(exclude).indexOf('/') !== -1) {
      debug('excluding from processing: ' + exclude);
      return;
    }

    try {
      var resolved = path.resolve(directory, exclude);
      var stats = fs.lstatSync(resolved);

      if (stats.isDirectory()) {
        dirs.push(this.stripTrailingSlash(exclude));

      } else if (stats.isFile()) {
        exclude = path.basename(exclude);
        files.push(exclude);
      }
    // Ignore files that don't exist
    } catch (e) {}
  }, this);

  if (dirs.length) {
    results.directoriesPattern = new RegExp(dirs.join('|'));
    results.directories = dirs;
  }

  if (files.length) {
    results.filesPattern = new RegExp(files.join('|'));
    results.files = files;
  }

  return results;
};

/**
 * @param  {String} str
 * @return {String}
 */
module.exports.stripTrailingSlash = function(str) {
  if (str[str.length - 1] === '/') {
    return str.slice(0, -1);
  }

  return str;
};
