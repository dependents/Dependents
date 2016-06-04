var path = require('path');
var ConfigFile = require('requirejs-config-file').ConfigFile;
var glob = require('glob-all');
var debug = require('debug')('dependents');
var extend = require('extend');

var computeDependents = require('./lib/computeDependents');
var util = require('./lib/util');
var WorkerManager = require('./lib/WorkerManager');

/**
 * Computes the dependents for the given file across a directory or list of filenames
 *
 * @param  {Object}       options
 * @param  {String}       options.filename  - The file whose dependents to compute
 * @param  {String|Array} options.directory - Directory name or list of filenames to process
 * @param  {String}       [options.config]  - Path to the shim config
 * @param  {String[]}     [options.exclusions] - List of files and directories to exclude
 * @param  {String[]}     [options.files] - Allows workers to process predetermined sets of files
 *
 */
module.exports = function(options, cb) {
  if (!cb) { throw new Error('expected success callback'); }

  if (!options || !options.filename) {
    cb(new Error('expected a filename'));
  }

  if (!options.directory) { cb(new Error('expected directory name')); }

  var directory = util.stripTrailingSlash(options.directory);
  var filename = path.resolve(options.filename);

  var exclusions = options.exclusions || [];
  var config = options.config;
  var webpackConfig = options.webpackConfig;

  debug('filename: ' + filename);
  debug('directory: ' + directory);
  debug('config: ' + config);
  debug('webpackConfig: ' + webpackConfig);
  debug('exclusions: ', exclusions);

  if (typeof exclusions === 'string') {
    exclusions = exclusions.split(',');
  }

  var _excludes = module.exports.DEFAULT_EXCLUDE_DIR.concat(exclusions);
  debug('exclusions w/ defaults: ', _excludes);
  exclusions = util.processExcludes(_excludes, directory);
  debug('processed exclusions: ', exclusions);

  if (config && typeof config !== 'object') {
    debug('converting the config path to an object');
    config = module.exports._readConfig(options.config);
  }

  // Look-up-table whose keys are filenames of JS files in the directory
  // the value for each key is an object of (filename -> dummy value)
  // files that depend on the key
  var dependents = {};

  var files = options.files;

  if (!files) {
    files = getFilesToProcess({
      filename: filename,
      directory: directory,
      exclusions: exclusions
    });

    debug('Grabbed ' + files.length + ' files');
  }

  var configuration = {
    directory: directory,
    config: config,
    configPath: options.config,
    webpackConfig: webpackConfig
  };

  debug('configuration: \n', configuration);

  if (module.exports._shouldParallelize(files)) {
    configuration.files = files;
    var workerManager = new WorkerManager(configuration);

    workerManager.computeAllDependents()
    .then(function(allDependents) {
      cb(null, Object.keys(allDependents[filename]));
    })
    .catch(cb);

    return;
  }

  files.forEach(function(filename) {
    configuration.filename = filename;
    var results = computeDependents(configuration);

    debug('computed dependents map', results);
    extend(true, dependents, results);
  });

  debug('final dependents map', dependents);
  debug('dependents for ' + filename + ': ', dependents[filename]);

  // Default to empty object if the given file isn't in the map
  cb(null, Object.keys(dependents[filename] || {}));
};

/**
 * Exposed for testing
 * @private
 * @param  {String} configPath
 * @return {Object}
 */
module.exports._readConfig = function(configPath) {
  return new ConfigFile(configPath).read();
};

/**
 * Exposed for testing
 *
 * @param  {String[]} files
 * @return {Boolean}
 */
module.exports._shouldParallelize = function(files) {
  var minimumNumberOfFiles = 500;
  return files.length >= minimumNumberOfFiles;
};

/**
 * Set of directories to ignore by default
 * @type {Array}
 */
module.exports.DEFAULT_EXCLUDE_DIR = [
  'node_modules',
  'bower_components',
  'vendor'
];

/**
 * @param  {Object} options
 * @return {String[]}
 */
function getFilesToProcess(options) {
  var filename = options.filename;
  var exclusions = options.exclusions;
  var directory = options.directory;

  var exts = getExtensionsToProcess(filename);

  var extensions = exts.length > 1 ?
                   '+(' + exts.join('|') + ')' :
                   exts[0];

  var globbers = [
    directory + '/**/*' + extensions
  ];

  globbers = globbers.concat(exclusions.directories.map(function(d) {
    return '!' + directory + '/' + d + '/**/*';
  })
  .concat(exclusions.files.map(function(f) {
    return '!' + directory + '/**/' + f;
  })));

  debug('globbers: ' + globbers.join('\n'));

  return glob.sync(globbers);
}

/**
 * Get a list of possible file extensions associated with the given file
 *
 * @param  {String} filename
 * @return {String[]}
 */
function getExtensionsToProcess(filename) {
  var exts = [''];

  if (util.isSassFile(filename)) {
    exts = ['.scss', '.sass'];

  } else if (util.isStylusFile(filename)) {
    exts = ['.styl'];

  // Which extensions can possibly include the given file
  } else {
    exts = ['.js', '.styl', '.sass', '.scss'];
  }

  return exts;
}
