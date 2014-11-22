var dir = require('node-dir'),
    path = require('path');

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
      if (err) { throw err; }

      if (options.contentCb) {
        options.contentCb(path.resolve(options.directory, filename), content);
      }

      next();
    },
    function(err, files) {
      if (err) throw err;
      if (options.filesCb) {
        options.filesCb(files);
      }
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
