#!/usr/bin/env node

'use strict';

var lookup = require('../lib/lookup');

var config = process.argv[2];
var path = process.argv[3];

console.log(lookup(config, path));
