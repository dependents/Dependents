var fs = require('fs');
var path = require('path');
var debug = require('debug')('backend');

/** @constructor */
function Config() {}

/**
 * The name of the config file
 * @type {String}
 */
Config.NAME = '.deprc';

/**
 * Recursively finds the directory containing the deprc file
 *
 * @param  {String} directory
 * @throws When the deprc could not be found
 * @return {String} The directory containing the .deprc file
 */
Config.prototype.find = function(directory) {
  debug('searching for deprc in ' + directory);

  if (!directory || directory === '/') {
    throw new Error('.deprc file could not be found');
  }

  var configFile = path.join(directory, Config.NAME);

  if (fs.existsSync(configFile)) {
    debug('found .deprc file in ' + directory);
    return directory;
  }

  return this.find(path.dirname(directory));
};

Config.prototype.findAndLoad = function(directory) {
  var locationOfDeprc = this.find(directory);
  this.load(locationOfDeprc + '/' + Config.NAME);
};

/**
 * Populates this instance with the configuration values
 *
 * @param  {String} configPath - Path to the .deprc
 */
Config.prototype.load = function(configPath) {
  var config = this._read(configPath);

  debug('loaded config: ', config);

  this.stylesRoot = getAbsolute(config.styles_root || config.sass_root, configPath);
  this.buildConfig = getAbsolute(config.build_config, configPath);
  this.webpackConfig = getAbsolute(config.webpack_config, configPath);
  this.requireConfig = getAbsolute(config.config || config.require_config, configPath);
  this.directory = getAbsolute(config.root || this.stylesRoot, configPath);

  if (!this.directory) {
    throw new Error('Either a root or styles_root must be defined in your .deprc file');
  }

  this.exclude = config.exclude || [];

  if (typeof this.exclude === 'string') {
    this.exclude = this.exclude.split(',');
  }
};

function getAbsolute(filepath, base) {
  return filepath ? path.resolve(path.dirname(base), filepath) : '';
}

/**
 * @private
 * @param {String} configPath
 * @throws when the deprc is not valid json
 * @return {Object}
 */
Config.prototype._read = function(configPath) {
  var content = fs.readFileSync(configPath, 'utf8');

  var config;
  try {
    config = JSON.parse(content);
  } catch (e) {
    debug('json load error: ' + e.message);
    throw new Error('.deprc config is not valid json');
  }

  return config;
};

/**
 * Convenience function to load up the config by recursively searching
 * for it starting with the given directory
 *
 * @param  {String} directory
 */
Config.prototype.init = function(directory) {
  this.load(this.find(directory));
};

module.exports = Config;
