var path = require('path'),
    dir = require('node-dir');

function extend(a, b) {
  for(var prop in b) {
    a[prop] = b[prop];
  }
}

/**
 * Returns the list of JS filenames within the given directory (and its subdirectories).
 *
 * @param {Object} options
 * @param {String} options.directory
 * @param {Object} [options.dirOptions] - Options to feed into node dir
 * @param {Function} [options.filesCb] - ({Array}) -> null - Executed with the list of found JS files within the directory
 * @param {Function} [options.contentCb] - ({String}, {String}) -> null - Executed with the filename and contents of the file
 */
module.exports = function(options) {
  options = options || {};

  var defaults = {
    match:   /.js$/,
    exclude: /^\./,
    excludeDir: /node_modules/
  };

  var directory = options.directory,
      dirOptions = options.dirOptions || {},
      contentCb = options.contentCb,
      filesCb = options.filesCb;

  extend(defaults, dirOptions);

  directory = path.resolve(directory);

  dir.readFiles(directory, defaults,
  function(err, content, currentFile, next) {
    if (err) throw err;

    if (contentCb) contentCb(path.resolve(currentFile), content);

    next();
  },
  function(err, files){
    if (err) throw err;

    files = files.map(function(filename) {
      return path.resolve(filename);
    });

    filesCb(files);
  });
};
