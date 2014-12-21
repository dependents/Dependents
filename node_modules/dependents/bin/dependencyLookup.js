#!/usr/bin/env node

'use strict';

var lookup = require('module-lookup-amd');

var program = require('commander');

program
  .version(require('../package.json').version)
  .usage('[options] <path>')
  .option('-c, --config [path]', 'location of a RequireJS config file for AMD')
  .parse(process.argv);

var config = program.config;
var path = program.args[0];

console.log(lookup(config, path));
