/**
 * @param  {String}  filename
 * @return {Boolean}
 */
module.exports = function(filename) {
  return filename.indexOf('..') === 0 || filename.indexOf('.') === 0;
}
