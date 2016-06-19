var Config = require('./Config');
var getPath = require('./getPath');
var getClickedImport = require('./getClickedImport');
var mixpanel = require('./mixpanel');

var cabinet = require('filing-cabinet');
var findDependents = require('dependents');
var callers = require('callers');
var tree = require('dependency-tree');
var findDrivers = require('taxicab');

var q = require('q');
var path = require('path');
var debug = require('debug')('backend');

module.exports = function(program) {
  var deferred = q.defer();

  // Useful for consumers like Atom
  // TODO: Find a way to enable debug all the way down
  if (program.debug) {
    debug = console.log.bind(console);
  }

  if (program.editor) {
    mixpanel.track('Editor', {
      name: program.editor
    });
  }

  // Use an already loaded Config instance, if supplied
  // Useful for tests that want to hijack the config loading process
  var config = program.deprc;
  try {
    if (!config) {
      config = new Config();
      config.findAndLoad(path.dirname(program.filename));
    }
    debug('processed config', config);

  } catch (e) {
    mixpanel.track('Setup Exception', {message: e.message});

    debug('error when searching for deprc file: ' + e.message);
    deferred.reject(e.message);
    return deferred.promise;
  }

  var options = {
    directory: config.directory,
    filename: program.filename,
    exclude: config.exclude,
    config: config.requireConfig,
    webpackConfig: config.webpackConfig
  };

  debug('command options', options);

  if (program.lookup) {
    if (!program.lookupPosition) {
      options.partial = program.args[0].replace(/["|'|;]/g, '');
    } else {
      debug('given a lookup location: ', program.lookupPosition);
      options.partial = getClickedImport(program.args[0], Number(program.lookupPosition));
    }

    debug('performing a lookup with options: ', options);

    var result = cabinet(options);

    debug('lookup result: ' + result);
    mixpanel.track('Run_JumpToDependency');
    deferred.resolve(result);

  } else if (program.findDependents) {
    debug('finding the dependents of the given file: ' + options.filename);

    findDependents(options, function(err, dependents) {
      if (err) {
        var msg = err.message || err;

        mixpanel.track('Find_Dependents_Error', {
          message: msg
        });

        debug('error: ', msg);

        deferred.reject(msg);
        return;
      }

      debug('found the following dependents: ', dependents);
      mixpanel.track('Run_Dependents');

      deferred.resolve(dependents);
    });

  } else if (program.getPath) {
    mixpanel.track('Get_Path');

    deferred.resolve(getPath({
      filename: options.filename,
      directory: options.directory,
      stylesDirectory: config.stylesRoot
    }));

  } else if (program.findCallers) {
    options.functionName = program.args[0].replace(/["|'|;]/g, '');

    options.success = function(err, callers) {
      if (err) {
        var msg = err.message || err;
        mixpanel.track('Callers_Error', {message: msg});
        deferred.reject(msg);
      } else {
        deferred.resolve(callers);
      }
    };

    debug('finding the callers of "' + options.functionName + '" with options: ', options);
    mixpanel.track('Run_Callers');
    callers(options);

  } else if (program.getTree) {
    options.root = options.directory;
    mixpanel.track('Run_Tree');

    try {
      var results = tree(options);
      deferred.resolve(results);
    } catch (e) {
      mixpanel.track('Tree_Error', {message: e.message || e});
      deferred.reject(e.message);
    }

  } else if (program.findDrivers) {
    options.buildConfig = config.buildConfig;
    debug('build config: ' + options.buildConfig);
    mixpanel.track('Run_Find_Driver');

    options.success = function(err, drivers) {
      if (err) {
        var msg = e.message || err;
        mixpanel.track('Find_Drivers_Error', {message: msg});
        deferred.reject(msg);
      } else {
        deferred.resolve(drivers);
      }
    };

    findDrivers(options);

  } else if (program.getConfig) {
    deferred.resolve(config.toJSON());

  } else {
    deferred.reject('No valid command given');
  }

  return deferred.promise;
};
