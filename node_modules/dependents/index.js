var path = require('path');
var fs = require('fs');
var getJSFiles = require('get-all-js-files');
var ConfigFile = require('requirejs-config-file').ConfigFile;
var computeDependents = require('./lib/computeDependents');

var util = require('./lib/util');

/**
 * Computes the dependents for the given file across a directory or list of filenames
 *
 * @param  {Object}       options
 * @param  {String}       options.filename  - The file whose dependents to compute
 * @param  {String|Array} options.directory - Directory name or list of filenames to process
 * @param  {Function}     options.success   - ({String[]}) -> null - Executed with the dependents for the given filename
 * @param  {String}       [options.config]  - Path to the shim config
 * @param  {String[]}     [options.exclusions] - List of files and directories to exclude
 */
module.exports = function dependents(options) {
  if (!options || !options.filename) {
    throw new Error('expected a filename');
  }

  if (!options.success) { throw new Error('expected success callback'); }
  if (!options.directory) { throw new Error('expected directory name'); }

  options.filename = path.resolve(options.filename);
  options.exclusions = options.exclusions || [];

  // Look-up-table whose keys are filenames of JS files in the directory
  // the value for each key is an object of (filename -> dummy value)
  // files that depend on the key
  options.dependents = {};

  if (options.config && typeof options.config !== 'object') {
    options.config = dependents._readConfig(options.config);
  }

  processFiles(options);
};

module.exports._readConfig = function(configPath) {
  return new ConfigFile(configPath).read();
};

/**
 * @param  {Object}   options
 * @param  {String}   options.directory
 * @param  {String}   options.filename
 * @param  {Function} options.success
 * @param  {String[]} [options.files] - Allows workers to process predetermined sets of files
 * @param  {String[]} [options.excludes]
 */
function processFiles(options) {
  var directory = options.directory;
  var filename = options.filename;
  var files = options.files;
  var cb = options.success;

  var done = function() {
    cb(null, Object.keys(options.dependents[filename] || {}));
  };

  var _processDeps = function(file, content) {
    computeDependents({
      filename: file,
      content: content,
      directory: directory,
      dependents: options.dependents,
      config: options.config
    });
  }

  var _excludes = util.DEFAULT_EXCLUDE_DIR.concat(options.exclusions);
  var exclusions = util.processExcludes(_excludes, directory);

  var fileOptions = {
    directory: directory,
    dirOptions: {
      excludeDir: exclusions.directories,
      exclude: exclusions.files
    },
    contentCb: _processDeps,
    filesCb: done
  };

  if (!files) {
    if (util.isSassFile(filename)) {
      util.getSassFiles(fileOptions);
    } else {
      getJSFiles(fileOptions);
    }

  } else {
    files.forEach(function(filename) {
      try {
        _processDeps(filename, fs.readFileSync(filename, 'utf8'));
      } catch (e) {
        cb(e, []);
      }
    });

    done();
  }
}
