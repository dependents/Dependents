var computeDependents = require('./computeDependents');
var extend = require('extend');

var debug = require('debug')('dependents');

/**
 * @param  {Object} args
 * @param  {String} args.directory
 * @param  {String[]} args.files
 * @param  {Object} args.config
 */
process.on('message', function(args) {
  var dependents = {};
  var tag = 'worker_' + process.pid;

  debug(tag, ' processing ' + args.files.length + ' files');

  args.files.forEach(function(filename) {
    debug(tag, 'computing dependents for', filename.replace(args.directory, ''));

    var results = computeDependents({
      filename: filename,
      directory: args.directory,
      config: args.config,
      configPath: args.configPath,
      webpackConfig: args.webpackConfig
    });

    extend(true, dependents, results);
  });

  process.send({
    dependents: dependents
  });
});
