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

  this.stylesRoot = config.styles_root || config.sass_root;
  this.buildConfig = config.build_config;
  this.webpackConfig = config.webpack_config;
  this.requireConfig = config.config || config.require_config;
  this.directory = config.root || this.stylesRoot;

  if (this.requireConfig) {
    this.requireConfig = path.resolve(path.dirname(configPath), this.requireConfig);
  }

  if (this.webpackConfig) {
    this.webpackConfig = path.resolve(path.dirname(configPath), this.webpackConfig);
  }

  // CSS users shouldn't need to supply a JS root
  this.directory = path.resolve(path.dirname(configPath), this.directory);

  this.exclude = config.exclude ? config.exclude.split(',') : [];
};

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
