#!/usr/bin/env node

'use strict';

var lookup = require('module-lookup-amd');

var config = process.argv[2];
var path = process.argv[3];

console.log(lookup(config, path));
