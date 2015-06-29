#!/usr/bin/env node

'use strict';

var lookup = require('../');
var program = require('commander');

program
  .version(require('../package.json').version)
  .usage('[options] <path>')
  .option('-f, --filename [path]', 'file containing the dependency')
  .option('-d, --directory [path]', 'location of all stylus files')
  .parse(process.argv);

var filename = program.filename;
var directory = program.directory;
var dep = program.args[0];

console.log(lookup(dep, filename, directory));
