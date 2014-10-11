var path = require('path'),
    dir = require('node-dir');

/**
 * Returns the list of JS filenames within the given directory (and its subdirectories).
 * Exposed for convenience.
 *
 * @param  {Object}   options
 * @param  {String}   options.directory
 * @param  {Function} options.filesCb     - ({Array}) -> null - Executed with the list of found JS files within the directory
 * @param  {Function} [options.contentCb] - ({String}, {String}) -> null - Executed with the filename and contents of the file
 */
module.exports = function(options) {
  options = options || {};

  var directory = options.directory,
      contentCb = options.contentCb,
      filesCb   = options.filesCb;

  directory = path.resolve(directory);

  dir.readFiles(directory, {
    match:   /.js$/,
    exclude: /^\./,
    excludeDir: /node_modules/
  },
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