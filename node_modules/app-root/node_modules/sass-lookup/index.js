var path = require('path');
var fs = require('fs');
var isRelativePath = require('is-relative-path');

/**
 * Determines the resolved dependency path according to
 * the Sass compiler's dependency lookup behavior
 *
 * @param  {String} dep - the import name
 * @param  {String} filename - the file containing the import
 * @param  {String} directory - the location of all sass files
 * @return {String}
 */
module.exports = function(dep, filename, directory) {
  var fileDir = path.dirname(filename);

  // Use the file's extension if necessary
  var ext = path.extname(dep) ? '' : path.extname(filename);
  var sassDep;

  if (isRelativePath(dep)) {
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
