var assert = require('assert');
var getDrivers = require('../');
var fs = require('fs');

describe('get-driver-scripts', function() {
  it('returns the build modules from a requirejs build config', function(done) {
    getDrivers({
      directory: __dirname + '/example',
      buildConfig: __dirname + '/example/build.json',
      success: function(err, drivers) {
        assert(!err);
        assert(drivers.length);
        drivers.forEach(function(d) {
          assert(fs.existsSync(d));
        });
        done();
      }
    });
  });

  it('returns the found application roots if no config was supplied', function(done) {
    getDrivers({
      directory: __dirname + '/example',
      success: function(err, drivers) {
        assert(!err);
        assert(drivers.length);
        done();
      }
    });
  });

  it('throws if the success callback was not given', function() {
    assert.throws(function() {
      getDrivers({
        directory: __dirname + '/example'
      });
    });
  });

  it('throws if the directory was not given', function() {
    assert.throws(function() {
      getDrivers({
        success: function() {}
      })
    });
  });
});