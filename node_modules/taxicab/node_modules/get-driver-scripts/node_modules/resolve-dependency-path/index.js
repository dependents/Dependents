var path = require('path');

/**
 * Resolve a dependency's path
 * @param  {String} dep - The dependency name to resolve
 * @param  {String} filename - Filename that contains the dependency
 * @param  {String} directory - Root of all files
 * @return {String} Absolute/resolved path of the dependency
 */
module.exports = function(dep, filename, directory) {
  if (!dep) { throw new Error('dependency path not given'); }
  if (!filename) { throw new Error('filename not given'); }
  if (!directory) { throw new Error('directory not given'); }

  var depExt = path.extname(dep);
  var fileExt = path.extname(filename);
  var filepath;

  if (isRelative(dep)) {
    filepath = path.resolve(path.dirname(filename), dep);
  } else {
    filepath = path.resolve(directory, dep);
  }

  if (!depExt) {
    filepath += fileExt;
  } else {
    // If a dependency starts with a period AND it doesn't already end
    // in .js AND doesn't use a custom plugin, add .js back to path.
    if (fileExt === '.js' && depExt !== '.js' && dep.indexOf('!') < 0) {
      filepath += fileExt;
    } else {
      // If using a SystemJS style plugin
      if (depExt.indexOf('!') > -1) {
        filepath += depExt.substring(0, depExt.indexOf('!'));
      }
    }
  }

  return filepath;
}

function isRelative(dep) {
  return dep.indexOf('..') === 0 || dep.indexOf('.') === 0;
}
