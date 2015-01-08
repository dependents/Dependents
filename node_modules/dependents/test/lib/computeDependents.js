var assert = require('assert');
var computeDependents = require('../../lib/computeDependents');
var fs = require('fs');
var path = require('path');

describe('lib/computeDependents', function() {
  var dir = path.resolve(__dirname, '../example/commonjs');
  var dependents;

  beforeEach(function() {
    dependents = {};
  });

  it('computes the dependents of the given file', function() {
    var filename = dir + '/a.js';

    computeDependents({
      filename: filename,
      content: fs.readFileSync(filename, 'utf8'),
      directory: dir,
      dependents: dependents
    });

    assert(Object.keys(dependents[dir + '/b.js'])[0] === filename);
  });

  it('does nothing for an empty file', function() {
    computeDependents({
      filename: dir + '/a.js',
      content: '',
      directory: dir,
      dependents: dependents
    });

    assert(!Object.keys(dependents).length);
  });
});