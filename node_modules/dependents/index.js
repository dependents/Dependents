var precinct = require('precinct');
var path = require('path');
var fs = require('fs');
var lookup = require('module-lookup-amd');
var getJSFiles = require('get-all-js-files');
var ConfigFile = require('requirejs-config-file').ConfigFile;
var resolveDepPath = require('resolve-dependency-path');

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
module.exports.for = function(options) {
  if (!options || !options.filename) {
    throw new Error('expected filename whose dependents to compute');
  }

  options.filename = path.resolve(options.filename);
  options.exclusions = options.exclusions || [];

  // Look-up-table whose keys are filenames of JS files in the directory
  // the value for each key is an object of (filename -> dummy value)
  // files that depend on the key
  options.dependents = {};

  if (options.config && typeof options.config !== 'object') {
    options.config = this._readConfig(options.config);
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

  if (!cb) { throw new Error('expected callback'); }
  if (!directory) { throw new Error('expected directory name'); }

  var done = function() {
    cb(Object.keys(options.dependents[filename] || {}));
  };

  var _excludes = util.DEFAULT_EXCLUDE_DIR.concat(options.exclusions);
  var exclusions = util.processExcludes(_excludes, directory);

  var fileOptions;

  if (!files) {
    fileOptions = {
      directory: directory,
      dirOptions: {
        excludeDir: exclusions.directories,
        exclude: exclusions.files
      },
      contentCb: function(file, content) {
        processDependents({
          filename: file,
          content: content,
          directory: directory,
          dependents: options.dependents,
          config: options.config
        });
      },
      // When all files have been processed
      filesCb: done
    };

    if (util.isSassFile(filename)) {
      util.getSassFiles(fileOptions);
    } else {
      getJSFiles(fileOptions);
    }

  } else {
    files.forEach(function(filename) {
      try {
        processDependents({
          filename: filename,
          content: fs.readFileSync(filename, 'utf8'),
          directory: directory,
          dependents: options.dependents,
          config: options.config
        });
      } catch (e) {
        console.log(e);
      }
    });

    done();
  }
}

/**
 * Registers all dependencies of the given file as "used"
 *
 * @param {Object} options
 * @param {String} options.filename
 * @param {String} options.fileContent
 * @param {String} options.directory
 * @param {Object} options.dependents - hash of dependents found so far
 */
function processDependents(options) {
  var filename = options.filename;
  var fileContent = options.content;
  var directory = options.directory;
  var dependents = options.dependents;
  var dependencies;

  if (!fileContent) { return; }

  try {
    if (util.isSassFile(filename)) {
      dependencies = precinct(fileContent, 'sass');
    } else {
      dependencies = precinct(fileContent);
    }
  } catch (e) {
    return;
  }

  dependents[filename] = dependents[filename] || {};

  // Register the current file as dependent on each dependency
  dependencies.forEach(function(dep) {
    // Look up the dep to see if it's aliased in the config
    if (options.config && !util.isSassFile(filename)) {
      dep = lookup(options.config, dep);
    }

    dep = resolveDepPath(dep, filename, directory);

    dependents[dep] = dependents[dep] || {};
    dependents[dep][filename] = 1;
  });
}
