var getJSFiles = require('../../lib/getJSFiles'),
    assert = require('assert'),
    path = require('path');

var dir = path.resolve(__dirname, '../example');

describe('lib/getJSFiles', function() {
  it('returns all of the JS files within a given directory', function(done) {
    getJSFiles({
      directory: dir,
      filesCb: function(files) {
        var withJSExt = files.filter(function(filename) {
          return path.extname(filename) === '.js';
        });
        assert(files.length);
        assert(files.length === withJSExt.length);
        done();
      }
    });
  });
});
