var assert = require('assert');
var path = require('path');

var util = require('../../lib/util');

describe('lib/util', function() {
  describe('processExcludes', function() {
    it('returns an bare object if no excludes were supplied', function() {
      var results = util.processExcludes(null, null);
      assert.ok(!results.directories.length);
      assert.ok(!results.directoriesPattern);
      assert.ok(!results.files.length);
      assert.ok(!results.filesPattern);
    });

    it('returns a regexp of the excluded directories', function() {
      var results = util.processExcludes(['example'], path.resolve(__dirname, '../'));

      assert.ok(results.directories.length);
      assert.ok(results.directoriesPattern instanceof RegExp);
      assert.ok(!results.files.length);
      assert.ok(!results.filesPattern);
    });

    it('returns a regexp of the excluded files', function() {
      var results = util.processExcludes(['error.js'], path.resolve(__dirname, '../example'));

      assert.ok(!results.directories.length);
      assert.ok(!results.directoriesPattern);
      assert.ok(results.filesPattern instanceof RegExp);
      assert.ok(results.files.length);
    });

    it('does not throw for excludes that do not exist', function() {
      assert.doesNotThrow(function() {
        util.processExcludes(['foobar.js'], path.resolve(__dirname, '../example'));
      });
    });
  });

  describe('isSassFile', function() {
    it('returns true if the filename has a sass extension', function() {
      assert.ok(util.isSassFile('foo.scss'));
      assert.ok(util.isSassFile('_foo.scss'));
      assert.ok(util.isSassFile('foo.sass'));
      assert.ok(util.isSassFile('_foo.sass'));
      assert.ok(util.isSassFile('bar/foo.sass'));
      assert.ok(!util.isSassFile('bar/foo.js'));
    });
  });

  describe('isStylusFile', function() {
    it('returns true if the filename has a styl extension', function() {
      assert.ok(util.isStylusFile('foo.styl'));
      assert.ok(util.isStylusFile('_foo.styl'));
      assert.ok(!util.isStylusFile('foo.sass'));
      assert.ok(!util.isStylusFile('_foo.js'));
    });
  });

  describe('isJSFile', function() {
    it('returns true if the filename has a js extension', function() {
      assert.ok(util.isJSFile('foo.js'));
      assert.ok(util.isJSFile('_foo.js'));
      assert.ok(util.isJSFile('bar/foo.js'));
      assert.ok(!util.isJSFile('bar/foo.scss'));
    });
  });

  describe('stripTrailingSlash', function() {
    it('returns the string without its trailing slash', function() {
      assert.equal(util.stripTrailingSlash('./'), '.');
      assert.equal(util.stripTrailingSlash('foo/'), 'foo');
      assert.equal(util.stripTrailingSlash('/'), '');
    });

    it('returns the original string if it does not have a trailing slash', function() {
      assert.equal(util.stripTrailingSlash('foo'), 'foo');
      assert.equal(util.stripTrailingSlash('.'), '.');
    });

    it('does not strip nested slashes', function() {
      assert.equal(util.stripTrailingSlash('foo/bar/'), 'foo/bar');
    });
  });
});