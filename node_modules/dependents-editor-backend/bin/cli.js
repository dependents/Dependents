#!/usr/bin/env node

'use strict';

var cli = require('../lib/cli');

var program = require('commander');

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
  .option('--lookup-position <value>', 'jump to dependency: location of the clicked character of the target')

  .option('--jump-to-definition', 'find the file to jump to based on the clicked element of a module')
  .option('--click-position <value>', 'jump to definition location of the click: row,col')

  .option('--find-dependents', 'get the dependents of the current file')
  .option('--find-drivers', 'get the driver scripts relevant to current file')
  .option('--find-callers', 'get the scripts calling the given function name')
  .option('--get-tree', 'get the dependency tree of the current file')
  .option('--get-tree-pic [imagePath]', 'get the dependency tree of the current file as a picture')
  .option('--get-path', 'get the import form of the current filename')

  .option('--get-config', 'get the contents of the parsed deprc config')

  // Editor tracking
  .option('--editor <name>', 'the editor being used')

  // Target extraction
  .parse(process.argv);

cli(program)
.then(cli.print)
.catch(function(message) {
  console.error(message);
  process.exit(1);
});
