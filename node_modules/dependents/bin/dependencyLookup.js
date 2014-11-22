#!/usr/bin/env node

'use strict';

var lookup = require('module-lookup-amd'),
    config = process.argv[2],
    path = process.argv[3];

console.log(lookup(config, path));
