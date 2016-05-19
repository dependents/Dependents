#!/usr/bin/env node

'use strict';

var lookup = require('../');

var program = require('commander');

program
  .version(require('../package.json').version)
  .usage('[options] <path>')
  .option('-c, --config <path>', 'location of a RequireJS config file for AMD')
  .option('-f, --filename <path>', 'file containing the dependency')
  .option('-d, --directory <path>', 'directory containing all files')
  .parse(process.argv);

var config = program.config;
var filename = program.filename;
var path = program.args[0];

console.log(lookup(config, path, filename));
