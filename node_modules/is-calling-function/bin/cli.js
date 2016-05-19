#!/usr/bin/env node

var filename = process.argv[2];
var functionName = process.argv[3];
var isCallingFunction = require('../');
var fs = require('fs');

var source = fs.readFileSync(filename, 'utf8');
console.log(isCallingFunction(source, functionName));
