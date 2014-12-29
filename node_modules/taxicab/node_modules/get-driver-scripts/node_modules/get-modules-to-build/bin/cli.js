#!/usr/bin/env node

'use strict';

var getModules = require('../'),
    filename = process.argv[2];

try {
  var modules = getModules(filename);
  modules.forEach(function(name) {
    console.log(name);
  });
} catch (e) {
  console.log(e);
}
