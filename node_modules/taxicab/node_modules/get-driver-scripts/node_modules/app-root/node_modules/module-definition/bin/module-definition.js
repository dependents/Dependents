#!/usr/bin/env node

'use strict';

var getModuleType = require('../'),
    filename = process.argv[2];

console.log(getModuleType.sync(filename));
