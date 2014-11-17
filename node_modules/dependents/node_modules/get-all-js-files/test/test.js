var getJSFiles = require('../'),
    assert = require('assert'),
    path = require('path'),
    sinon = require('sinon');

var dir = __dirname + '/example';

describe('lib/getJSFiles', function() {
  it('returns all of the JS files within a given directory', function(done) {
    getJSFiles({
      directory: dir,
      filesCb: function(files) {
        var withJSExt = files.filter(function(filename) {
          return path.extname(filename) === '.js';
        });
        assert(files.length === 3);
        assert(files.length === withJSExt.length);
        done();
      }
    });
  });

  it('calls the contentCb for each file', function(done) {
    var spy = sinon.spy();

    getJSFiles({
      directory: dir,
      contentCb: spy,
      filesCb: function(files) {
        assert(spy.called);
        done();
      }
    });
  });

  it('supports excluding directories', function(done) {
    getJSFiles({
      directory: dir,
      dirOptions: {
        excludeDir: /subdir/
      },
      filesCb: function(files) {
        assert(files.length === 2);
        done();
      }
    });
  });
});
