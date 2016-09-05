var Config = require('./Config');
var getPath = require('./getPath');
var mixpanel = require('./mixpanel');
var getClickedImport = require('./getClickedImport');
var jumpToDefinition = require('./jumpToDefinition');
var cabinet = require('filing-cabinet');
var findDependents = require('dependents');
var callers = require('callers');
var tree = require('dependency-tree');
var findDrivers = require('taxicab');
var treePic = require('tree-pic');

var q = require('q');
var path = require('path');
var debug = require('./debug');
var isPlainObject = require('is-plain-object');
var timer = require('node-tictoc');
timer.log = debug;

module.exports = function(program) {
  var deferred = q.defer();

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
    debug('processed config\n', config);

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

  debug('command options\n', options);

  if (program.lookup) {
    timer.tic();

    if (!program.lookupPosition) {
      options.partial = program.args[0].replace(/["|'|;]/g, '');
    } else {
      debug('given a lookup location: ', program.lookupPosition);
      options.partial = getClickedImport(program.args[0], Number(program.lookupPosition));
    }

    debug('performing a lookup with options:\n', options);

    var result = cabinet(options);

    timer.toc();
    debug('lookup result: ' + result);
    mixpanel.track('Run_JumpToDependency');
    deferred.resolve(result);

  } else if (program.jumpToDefinition) {
    debug('performing a jump to definition');

    if (!program.clickPosition) {
      throw new Error('a clickPosition must be provided');
    }

    debug('given click position: ', program.clickPosition);
    options.clickPosition = program.clickPosition;

    try {
      var result = jumpToDefinition(options);
      debug('jumpToDefinition result: ' + result);
      deferred.resolve(result);
    } catch (e) {
      deferred.reject(e);
      debug('jumpToDefinition error: ', e);
    }

    mixpanel.track('Run_JumpToDefinition');

  } else if (program.findDependents) {
    debug('finding the dependents of the given file: ' + options.filename);

    timer.tic();

    options.parallelThreshold = 250;

    findDependents(options, function(err, dependents) {
      timer.toc();

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
    timer.tic();
    mixpanel.track('Get_Path');

    var result = getPath({
      filename: options.filename,
      directory: options.directory,
      stylesDirectory: config.stylesRoot
    });

    timer.toc();
    deferred.resolve(result);

  } else if (program.findCallers) {
    timer.tic();
    options.functionName = program.args[0].replace(/["|'|;]/g, '');

    options.success = function(err, callers) {
      timer.toc();

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
    timer.tic();
    options.root = options.directory;
    mixpanel.track('Run_Tree');

    try {
      deferred.resolve(tree(options));

    } catch (e) {
      mixpanel.track('Tree_Error', {message: e.message || e});
      deferred.reject(e.message);

    } finally {
      timer.toc();
    }

  } else if (program.findDrivers) {
    timer.tic();

    options.buildConfig = config.buildConfig;
    debug('build config: ' + options.buildConfig);
    mixpanel.track('Run_Find_Driver');

    options.success = function(err, drivers) {
      timer.toc();

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
    debug('running getConfig');
    timer.tic();
    deferred.resolve(config.toJSON());
    timer.toc();

  } else if (program.getTreePic) {
    timer.tic();
    debug('running getTreePic');
    mixpanel.track('Run_Tree_PIc');

    options.requireConfig = options.config;

    if (typeof program.getTreePic === 'string') {
      options.imagePath = program.getTreePic;
    }

    treePic(options)
    .then(function(imagePath) {
      debug('treePic image path: ' + imagePath);
      deferred.resolve(imagePath);
    })
    .catch(function(error) {
      debug('treePic error: ' + error.message);
      mixpanel.track('Tree_Pic_Error', {message: error.message});

      deferred.reject(error);
    })
    .finally(function() {
      timer.toc();
    });

  } else {
    deferred.reject('No valid command given');
  }

  return deferred.promise;
};

module.exports.print = function(result) {
  if (!(result instanceof Array)) {
    result = [result];
  }

  result.forEach(function(r) {
    if (isPlainObject(r)) {
      r = JSON.stringify(r);
    }

    console.log(r);
  });
};
