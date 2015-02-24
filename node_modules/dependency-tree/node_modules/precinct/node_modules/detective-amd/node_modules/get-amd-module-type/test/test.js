var getType = require('../');
var esprima = require('esprima');
var fs = require('fs');
var assert = require('assert');

describe('get-amd-module-type', function() {
  it('returns the factory for the factory form', function() {
    assert(getType(__dirname + '/factory.js') === 'factory');
  });

  it('returns nodeps for the no dependency form', function() {
    assert(getType(__dirname + '/nodep.js') === 'nodeps');
  });

  it('returns named for the named form', function() {
    assert(getType(__dirname + '/named.js') === 'named');
  });

  it('returns deps for the dependency form', function() {
    assert(getType(__dirname + '/dep.js') === 'deps');
  });

  it('returns rem for the REM form (#2)', function() {
    assert(getType(__dirname + '/rem.js') === 'rem');
  });

  it('returns null for non-amd modules', function() {
    assert(getType(__dirname + '/empty.js') === null);
  });

  it('returns driver for a driver script', function() {
    assert(getType(__dirname + '/driver.js') === 'driver');
  });
});
