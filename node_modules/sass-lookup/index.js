var path = require('path');
var fs = require('fs');
var isRelativePath = require('is-relative-path');

function findDependency(searchDir, depName) {
  var nonPartialPath = path.resolve(searchDir, depName);
  if (fs.existsSync(nonPartialPath)) {
    return nonPartialPath;
  }

  var partialsPath = path.resolve(searchDir, '_' + depName);
  if (fs.existsSync(partialsPath)) {
    return partialsPath;
  }
}

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
  var depDir = isSlashed ? path.dirname(dep) : '';
  var depName = (isSlashed ? path.basename(dep) : dep) + ext;

  var relativeToFile = findDependency(path.resolve(fileDir, depDir), depName);
  if (relativeToFile) {
    return relativeToFile;
  }

  var directories = typeof directory === 'string' ? [directory] : directory;

  for (i in directories) {
    var dir = directories[i];
    var relativeToDir = findDependency(path.resolve(dir, depDir), depName);
    if (relativeToDir) {
      return relativeToDir;
    }
  }

  // old versions returned a static path, if one could not be found
  // do the same, if `directory` is not an array
  if (typeof directory === 'string') {
    return path.resolve(directory, depDir, depName);
  }
};
