var assert = require('assert');
var computeDependents = require('../../lib/computeDependents');
var path = require('path');

describe('lib/computeDependents', function() {
  var dir = path.resolve(__dirname, '../example/commonjs');

  it('computes the dependents of the given file', function() {
    var filename = dir + '/a.js';

    var dependents = computeDependents({
      filename: filename,
      directory: dir
    });

    assert.equal(Object.keys(dependents[dir + '/b.js'])[0], filename);
  });

  it('returns an empty object for a file with no dependents', function() {
    var filename = dir + '/a.js';
    var dependents = computeDependents({
      filename: filename,
      directory: dir
    });

    assert.equal(Object.keys(dependents[filename]).length, 0);
  });

  it('returns an empty object for a non-existent file', function() {
    var filename = dir + '/foobar.js';
    var dependents = computeDependents({
      filename: filename,
      directory: dir
    });

    assert.equal(Object.keys(dependents[filename]).length, 0);
  });
});
