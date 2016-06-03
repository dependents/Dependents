#!/usr/bin/env node

'use strict';

var getAppRoots = require('../');
var directory = process.argv[2];

if (!directory) {
  console.log('Please supply a directory');
  process.exit(1);
}

getAppRoots({
  directory: directory,
  success: function(roots) {
    roots.forEach(function(root) {
      console.log(root);
    });
  }
});
