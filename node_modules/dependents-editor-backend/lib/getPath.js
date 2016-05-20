var path = require('path');
var debug = require('debug')('backend');

module.exports = function(options) {
  var directoriesToStrip = [
    options.directory,
    options.stylesDirectory
  ];

  var dirLess = directoriesToStrip.reduce(function(strippedSoFar, directory) {
    if (!directory || strippedSoFar.indexOf(directory) === -1) {
      return strippedSoFar;
    }

    directory = directory[directory.length - 1] === '/' ? directory : directory + '/';
    return strippedSoFar.replace(directory, '');
  }, options.filename);

  var naked = dirLess.replace(path.extname(dirLess), '');

  debug('given filename: ' + options.filename);
  debug('dir stripped filename: ' + dirLess);
  debug('dir + ext stripped filename: ' + naked);

  return naked;
};
