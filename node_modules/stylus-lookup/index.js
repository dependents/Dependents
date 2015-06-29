var path = require('path');
var fs = require('fs');
var isRelativePath = require('is-relative-path');

/**
 * Determines the resolved dependency path according to
 * the Stylus compiler's dependency lookup behavior
 *
 * @param  {String} dep - the import name
 * @param  {String} filename - the file containing the import
 * @param  {String} directory - the location of all stylus files
 * @return {String}
 */
module.exports = function(dep, filename, directory) {
  var fileDir = path.dirname(filename);

  // Use the file's extension if necessary
  var ext = path.extname(dep) ? '' : path.extname(filename);
  var resolved;

  if (isRelativePath(dep)) {
    resolved = path.resolve(filename, dep) + ext;

    if (fs.existsSync(resolved)) { return resolved; }
  }

  var samedir = path.resolve(fileDir, dep) + ext;

  if (fs.existsSync(samedir)) { return samedir; }

  // Check for dep/index.styl file
  var indexFile = path.join(path.resolve(fileDir, dep), 'index.styl');
  if (fs.existsSync(indexFile)) { return indexFile; }

  return '';
};
