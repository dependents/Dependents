#!/usr/bin/env node

var callers = require('../');

var program = require('commander');

program
  .version(require('../package.json').version)
  .usage('[options] <filename> <functionName>')
  .option('-d, --directory <path>', 'location of JS files')
  .option('-c, --config [path]', 'location of a RequireJS config file for AMD')
  .option('-e, --exclude [path,...]',
    'comma-separated list of files and folder names to exclude')
  .parse(process.argv);

callers({
  filename: program.args[0],
  functionName: program.args[1],
  directory: program.directory,
  config: program.config,
  exclude: program.exclude,
  success: function(err, callers) {
    if (err) {
      throw err;
    }

    callers.forEach(function(c) {
      console.log(c);
    });
  }
});