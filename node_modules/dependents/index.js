var precinct   = require('precinct'),
    path       = require('path'),
    fs         = require('fs'),
    lookup     = require('module-lookup-amd'),
    getJSFiles = require('get-all-js-files'),
    util       = require('./lib/util'),
    ConfigFile = require('requirejs-config-file').ConfigFile,

    /**
     * Look-up-table whose keys are filenames of JS files in the directory
     * the value for each key is an object of (filename -> dummy value) files that depend on the key
     *
     * @type {Object}
     */
    dependents = {},

    /**
     * Loaded RequireJS configuration
     * @type {Object | null}
     */
    config;

/**
 * Computes the dependents for the given file across a directory or list of filenames
 *
 * @param  {Object}       options
 * @param  {String}       options.filename  - The file whose dependents to compute
 * @param  {String|Array} options.directory - Directory name or list of filenames to process
 * @param  {String}       [options.config]  - Path to the shim config
 * @param  {Function}     options.success   - ({String[]}) -> null - Executed with the dependents for the given filename
 */
module.exports.for = function(options) {
  if (!options || !options.filename) throw new Error('expected filename whose dependents to compute');

  options.filename = path.resolve(options.filename);

  if (options.config) {
    config = new ConfigFile(options.config).read();
  }

  processFiles.call(this, options);
};

/**
 * @param  {Object}   options
 * @param  {String}   options.directory
 * @param  {String}   options.filename
 * @param  {String[]} [options.files] - Allows workers to process predetermined sets of files
 * @param  {Function} options.success
 * @param  {Object}   options.shims
 */
function processFiles(options) {
  var directory = options.directory,
      filename  = options.filename,
      files     = options.files,
      cb        = options.success,
      fileOptions = {
        directory: directory,
        dirOptions: {
          excludeDir: /(node_modules|bower_components|vendor)/
        },
        contentCb: function(file, content) {
          processDependents(file, content, directory);
        },
        // When all files have been processed
        filesCb: function() {
          cb(getDependentsForFile(filename));
        }
      };

  if (!cb)        throw new Error('expected callback');
  if (!directory) throw new Error('expected directory name');

  if (!files) {
    if (util.isSassFile(filename)) {
      util.getSassFiles(fileOptions);
    } else {
      getJSFiles(fileOptions);
    }

  } else {
    files.forEach(function(filename) {
      var content = fs.readFileSync(filename).toString();
      try {
        processDependents(filename, content, directory);
      } catch (e) {
        console.log(e);
      }
    });

    cb(getDependentsForFile(filename));
  }
}

/**
 * Registers all dependencies of the given file as "used"
 *
 * @param {String} filename
 * @param {String} fileContent
 * @param {String} directory
 */
function processDependents(filename, fileContent, directory) {
  if (!fileContent) return;

  var dependencies;

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
    if (config && !util.isSassFile(filename)) {
      dep = lookup(config, dep);
    }

    if (isRelativePath(dep)) {
      dep = path.resolve(path.dirname(filename), dep);
    }

    dep = (directory ? path.resolve(directory, dep) : dep);

    if (util.isSassFile(filename)) {
      if (path.extname(dep) !== '.scss') {
        dep += '.scss';
      }
    } else if (!path.extname(dep)) {
      dep += '.js';
    }

    dependents[dep] = dependents[dep] || {};
    dependents[dep][filename] = 1;
  });
}

/**
 * @param  {String} filename
 * @return {Array}
 */
function getDependentsForFile(filename) {
  return Object.keys(dependents[filename] || {});
}

/**
 * @param  {String}  filename
 * @return {Boolean}
 */
function isRelativePath(filename) {
  return filename.indexOf('..') === 0 || filename.indexOf('.') === 0;
}
