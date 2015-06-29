var assert = require('assert');
var path = require('path');

var util = require('../../lib/util');

describe('lib/util', function() {
  describe('getFiles', function() {
    beforeEach(function() {
      this.exts = ['.scss', '.sass'];
    });

    it('returns the sass files in a given directory', function(done) {
      util.getFiles(this.exts, {
        directory: path.resolve(__dirname, '../'),
        filesCb: function(files) {
          assert.ok(files.length);
          done();
        }
      });
    });

    it('executes the contentCb with the file name and contents if given', function(done) {
      util.getFiles(this.exts, {
        directory: path.resolve(__dirname, '../example/sass'),
        contentCb: function(filename, content) {
          assert.ok(filename);
          assert.ok(content);
        },
        filesCb: function() {
          done();
        }
      });
    });
  });

  describe('processExcludes', function() {
    it('returns an bare object if no excludes were supplied', function() {
      var results = util.processExcludes(null, null);
      assert.ok(!results.directories);
      assert.ok(!results.files);
    });

    it('returns a regexp of the excluded directories', function() {
      var results = util.processExcludes(['example'], path.resolve(__dirname, '../'));

      assert.ok(results.directories);
      assert.ok(results.directories instanceof RegExp);
      assert.ok(!results.files);
    });

    it('returns a regexp of the excluded files', function() {
      var results = util.processExcludes(['error.js'], path.resolve(__dirname, '../example'));

      assert.ok(!results.directories);
      assert.ok(results.files instanceof RegExp);
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
  });
});