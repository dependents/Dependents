var assert = require('assert');
var resolvePath = require('../');

describe('resolve-dependency-path', function() {
  it('resolves with absolute paths', function() {
    var resolved = resolvePath('./bar', __dirname + '/foo.js', __dirname);
    assert(resolved.indexOf(__dirname) === 0);
  });

  it('resolves relative paths', function() {
    var resolved = resolvePath('./bar', __dirname + '/foo.js', __dirname);

    assert(resolved === __dirname + '/bar.js');
  });

  it('resolves non-relative paths', function() {
    var filename = __dirname + '/feature1/foo.js';
    var resolved = resolvePath('feature2/bar', filename, __dirname);
    assert(resolved === __dirname + '/feature2/bar.js');
  });

  it('throws if the dependency path is missing', function() {
    assert.throws(function() {
      resolvePath();
    });
  });

  it('throws if the filename is missing', function() {
    assert.throws(function() {
      resolvePath('./bar');
    });
  });

  it('throws if the directory is missing', function() {
    assert.throws(function() {
      resolvePath('./bar', __dirname + '/foo.js');
    });
  });
});
