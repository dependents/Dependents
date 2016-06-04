#!/usr/bin/env node

'use strict';

var cli = require('../lib/cli');

var program = require('commander');
var isPlainObject = require('is-plain-object');

program
  .version(require('../package.json').version)
  .usage('[options] <target>')

  .option('-d, --directory <path>', 'root of all files')
  .option('-c, --config <path>', 'location of the .deprc file')
  .option('-r, --require-config [path]', 'location of a RequireJS config file for AMD')
  .option('-w, --webpack-config [path]', 'location of a Webpack config file')
  .option('-f, --filename [path]', 'the current file in focus')
  .option('-e, --exclude [path,...]', 'comma-separated list of files/folders to exclude')

  // Feature flags
  .option('--lookup', 'perform a partial lookup for the jump to dependency feature')
  .option('--find-dependents', 'get the dependents of the current file')
  .option('--find-drivers', 'get the driver scripts relevant to current file')
  .option('--find-callers', 'get the scripts calling the given function name')
  .option('--get-tree', 'get the dependency tree of the current file')
  .option('--get-path', 'get the import form of the current filename')

  .option('--get-config', 'get the contents of the parsed deprc config')

  // Editor tracking
  .option('--editor', 'the editor being used')

  // Target extraction
  .parse(process.argv);

cli(program)
// TODO: consider moving into a cli.print method for testing
.then(function(result) {
  if (!(result instanceof Array)) {
    result = [result];
  }

  result.forEach(function(r) {
    if (isPlainObject(r)) {
      r = JSON.stringify(r);
    }

    console.log(r);
  });
})
.catch(function(message) {
  console.error(message);
  process.exit(1);
});
