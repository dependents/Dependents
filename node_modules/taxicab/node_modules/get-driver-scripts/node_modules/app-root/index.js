var precinct = require('precinct');
var path = require('path');
var q = require('q');
var dir = require('node-dir');
var gmt = require('module-definition');
var lookup = require('module-lookup-amd');
var resolveDep = require('resolve-dependency-path');

/**
 * Calls the given callback with a list of candidate root filenames
 *
 * @param {Object} options - Configuration options
 * @param {String} options.directory - Where to look for roots
 * @param {Function} options.success - Executed with the list of roots
 *
 * @param {String} [options.config] - Module loader configuration for aliased path resolution
 *
 * @param {String[]} [options.ignoreDirectories] - List of directory names to ignore in the root search
 * @param {String[]} [options.ignoreFiles] - List of filenames to ignore in the root search
 * @param {Boolean} [options.includeNoDependencyModules=false] - Whether or not to include modules with no dependencies
 */
module.exports = function(options) {
  options = options || {};

  if (!options.directory) { throw new Error('directory not given'); }
  if (!options.success) { throw new Error('success callback not given'); }

  options.directory = path.resolve(options.directory);
  options.includeNoDependencyModules = !!options.includeNoDependencyModules;

  getAllFiles(options)
  .then(function(files) {
    return files
    // Types are used to determine if lookups are necessary
    .map(function(file) {
      return fileObj = {
        path: file,
        type: path.extname(file) === '.js' ? gmt.sync(file) : ''
      };
    })
    // Remove non-modules
    .filter(function(fileObj) {
      return fileObj.type !== 'none';
    });
  })
  .then(function(files) {
    // Get all files that are not depended on
    return getIndependentFiles(files, options);
  })
  .done(function(files) {
    options.success(files);
  });
};

/**
 * Returns a list of all filepaths relative to the given directory
 *
 * @param  {Object}   options
 * @param  {String}   options.directory
 * @param  {String[]} [options.ignoreDirectories=null]
 * @param  {String[]} [options.ignoreFiles=null]
 * @return {Promise}
 */
function getAllFiles(options) {
  var deferred = q.defer();

  dir.readFiles(options.directory, {
    exclude: options.ignoreFiles || null,
    excludeDir: options.ignoreDirectories || null
  },
  function(err, content, next) {
    if (err) {
      deferred.reject(err);
      return;
    }

    next();
  },
  function(err, files) {
    if (err) {
      deferred.reject(err);
      return;
    }

    deferred.resolve(files);
  });

  return deferred.promise;
}

/**
 * @param  {Object[]} files
 * @param  {Object}   options
 * @param  {Boolean}  options.includeNoDependencyModules
 * @param  {String}   options.directory
 * @return {Promise}  Resolves with the list of independent filenames
 */
function getIndependentFiles(files, options) {
  // A look up table of all files used as dependencies within the directory
  var dependencies = {};

  files.forEach(function(file) {
    var deps;

    // If a file cannot be parsed, it shouldn't be considered a root
    try {
      deps = getNonCoreDependencies(file.path);
    } catch (e) {
      dependencies[file.path] = true;
      return;
    }

    if (!options.includeNoDependencyModules && !deps.length) {
      // Files with no dependencies are useless and should not be roots
      // so we add them to the list so they're no longer root candidates
      dependencies[file.path] = true;
      return;
    }

    deps.forEach(function(dep) {
      if (file.type === 'amd' && options.config) {
        dep = lookup(options.config, dep, file.path);
      }

      dep = resolveDep(dep, file.path, options.directory);
      dependencies[dep] = true;
    });
  });

  // Files that haven't been depended on
  return files
  .filter(function(file) {
    return typeof dependencies[file.path] === 'undefined';
  })
  .map(function(file) {
    return file.path;
  });
}

/**
 * Get a list of non-core dependencies for the given file
 * @param  {String} file
 * @return {String[]}
 */
function getNonCoreDependencies(file) {
  return precinct.paperwork(file, {
    includeCore: false
  });
}
