#!/usr/bin/env node

'use strict';

var findDriver  = require('../');
var program = require('commander');

program
  .version(require('../package.json').version)
  .usage('[options] <filename>')
  .option('-d, --directory <path>', 'location of JS files')
  .option('-b, --build-config [path]', 'location of a RequireJS build config file for AMD')
  .option('-w, --webpack-config [path]', 'location of a Webpack config')
  .option('-c, --config [path]', 'location of a RequireJS config for aliased paths')
  .parse(process.argv);

try {
  findDriver({
    filename: program.args[0],
    directory: program.directory,
    buildConfig: program.buildConfig,
    config: program.config,
    webpackConfig: program.webpackConfig,
    success: function(err, drivers) {
      drivers.forEach(function(driver) {
        console.log(driver);
      });
    }
  });
} catch (e) {
  console.log(e);
}
