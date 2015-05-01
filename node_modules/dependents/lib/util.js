var dir = require('node-dir');
var path = require('path');
var fs = require('fs');

/**
 * @param  {Object} options
 * @param  {String} options.directory
 * @param  {Function} options.contentCb
 * @param  {Function} options.filesCb
 */
module.exports.getSassFiles = function(options) {
  dir.readFiles(options.directory, {
    match: /(.scss|.sass)$/,
    exclude: /^\./
    },
    function(err, content, filename, next) {
      if (options.contentCb) {
        options.contentCb(path.resolve(options.directory, filename), content);
      }

      next();
    },
    function(err, files) {
      options.filesCb(files);
    });
};

/**
 * @param  {String}  filename
 * @return {Boolean}
 */
module.exports.isSassFile = function(filename) {
  var ext = path.extname(filename);
  return ext === '.scss' || ext === '.sass';
};

/**
 * Set of directories to ignore by default
 * @type {Array}
 */
module.exports.DEFAULT_EXCLUDE_DIR = [
  'node_modules',
  'bower_components',
  'vendor'
];

/**
 * Separates out the excluded directories and files
 *
 * @param  {String[]} excludes
 * @param  {String} directory - Used for resolving the exclusion to the filesystem
 *
 * @return {Object} results
 * @return {String} results.directories - regex representing the directories
 * @return {String} results.files - regex representing the files
 */
module.exports.processExcludes = function(excludes, directory) {
  var results = {
    directories: '',
    files: ''
  };

  var self = this;

  var dirs = [];
  var files = [];
  var dirsPattetn;
  var filesPattern;

  if (!excludes) { return results; }

  excludes.forEach(function(exclude) {
    try {
      var resolved = path.resolve(directory, exclude);
      var stats = fs.lstatSync(resolved);

      if (stats.isDirectory()) {
        dirs.push(self.stripTrailingSlash(exclude));
      } else if (stats.isFile()) {
        exclude = path.basename(exclude, path.extname(exclude));
        files.push(exclude);
      }
    // Ignore files that don't exist
    } catch (e) {}
  });

  if (dirs.length) {
    dirsPattern = dirs.join('|');
    results.directories = new RegExp(dirsPattern);
  }

  if (files.length) {
    filesPattern = files.join('|');
    results.files = new RegExp(filesPattern);
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

/**
 * @param  {String}  filename
 * @return {Boolean}
 */
module.exports.isRelativePath = function(filename) {
  return filename.indexOf('..') === 0 || filename.indexOf('.') === 0;
}
