var assert = require('assert');
var getDrivers = require('../');
var fs = require('fs');

describe('get-driver-scripts', function() {
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

  describe('amd', function() {
    beforeEach(function() {
      this._directory = __dirname + '/example/amd';
    });

    it('returns the build modules from a requirejs build config', function(done) {
      getDrivers({
        directory: this._directory,
        buildConfig: this._directory + '/build.json',
        config: this._directory + '/config.json',
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
        directory: this._directory,
        config: this._directory + '/config.json',
        success: function(err, drivers) {
          assert(!err);
          assert(drivers.length);
          done();
        }
      });
    });
  });

  describe('commonjs', function() {
    beforeEach(function() {
      this._directory = __dirname + '/example/commonjs';
    });

    it('returns the found application roots', function(done) {
      getDrivers({
        directory: this._directory,
        success: function(err, drivers) {
          assert.ok(!err);
          assert.equal(drivers.length, 1);
          assert.equal(drivers[0], this._directory + '/cjsDriver.js');
          done();
        }.bind(this)
      });
    });
  });
});