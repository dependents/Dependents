var ConfigFile = require('requirejs-config-file').ConfigFile;
var path = require('path');
var debug = require('debug')('lookup');
var find = require('find');
var fileExists = require('file-exists');
var requirejs = require('requirejs');

/**
 * Determines the real path of a potentially aliased dependency path
 * via the paths section of a require config
 *
 * @param  {Object} options - Pass a loaded config object if you'd like to avoid rereading the config
 * @param  {String} options.partial - the dependency name
 * @param  {String} options.filename - the file containing the dependency
 * @param  {String|Object} [options.config] - Pass a loaded config object if you'd like to avoid rereading the config
 * @param  {String|Object} [options.configPath] - The location of the config file used to create the preparsed config object
 *
 * @return {String}
 */
module.exports = function(options) {
  // If you want to supply a preparsed config object without a configPath, then
  // we have no way of knowing what the baseUrl should be.
  var configPath = options.configPath || options.filename;
  var config = options.config || {};
  var depPath = options.partial;
  var filename = options.filename;

  debug('config: ', config);
  debug('partial: ', depPath);
  debug('filename: ', filename);

  if (typeof config === 'string') {
    configPath = config;
    config = module.exports._readConfig(config);
    debug('converting given config file ' + configPath + ' to an object:\n', config);
  }

  debug('configPath: ', configPath);

  if (!config.baseUrl) {
    config.baseUrl = './';
    debug('set baseUrl to ' + config.baseUrl);
  }

  requirejs.config(config);

  depPath = stripLoader(depPath);

  var normalizedModuleId = requirejs.toUrl(depPath);

  var resolved = path.join(path.dirname(configPath), normalizedModuleId);

  debug('normalized module id: ' + normalizedModuleId);
  debug('resolved url: ' + resolved);

  // No need to search for a file that already has an extension
  // Need to guard against jquery.min being treated as a real file
  if (path.extname(resolved) && fileExists(resolved)) {
    debug(resolved + ' already has an extension and is a real file');
    return resolved;
  }

  var foundFile = findFileLike(normalizedModuleId, resolved) || '';

  if (foundFile) {
    debug('found file like ' + resolved + ': ' + foundFile);
  } else {
    debug('could not find any file like ' + resolved);
  }

  return foundFile;
};

function findFileLike(partial, resolved) {
  var fileDir = path.dirname(resolved);

  var pattern = escapeRegExp(resolved + '.');

  debug('looking for file like ' + pattern);
  debug('within ' + fileDir);

  var results = find.fileSync(new RegExp(pattern), fileDir);

  debug('found the following matches: ', results.join('\n'));

  // Not great if there are multiple matches, but the pattern should be
  // specific enough to prevent multiple results
  return results[0];
}

function stripLoader(partial) {
  var exclamationLocation = partial.indexOf('!');

  if (exclamationLocation !== -1) {
    debug('stripping off the plugin loader from ' + partial);
    partial = partial.slice(exclamationLocation + 1);
    debug('partial is now ' + partial);
  }

  return partial;
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

/**
 * Exposed for testing
 *
 * @private
 * @param  {String} configPath
 * @return {Object}
 */
module.exports._readConfig = function(configPath) {
  return new ConfigFile(configPath).read();
};
