var assert = require('assert');
var findDriver = require('../');

describe('taxicab', function() {
  it('finds the driver script associated with a given module', function(done) {
    findDriver({
      filename: __dirname + '/example/a.js',
      directory: __dirname + '/example',
      success: function(err, drivers) {
        assert(!err);

        assert(drivers.some(function(d) {
          return d.indexOf('driver.js') !== -1;
        }));

        done();
      }
    });
  });

  it('does not get confused with multiple driver scripts in a directory', function(done) {
    findDriver({
      filename: __dirname + '/example/b.js',
      directory: __dirname + '/example',
      success: function(err, drivers) {
        assert(!err);

        assert(drivers.some(function(d) {
          return d.indexOf('driver2.js') !== -1;
        }));

        done();
      }
    });
  });

  it('finds multiple driver scripts if applicable', function(done) {
    findDriver({
      filename: __dirname + '/example/c.js',
      directory: __dirname + '/example',
      success: function(err, drivers) {
        assert(!err);

        assert(drivers.some(function(d) {
          return d.indexOf('driver.js') !== -1;
        }));

        assert(drivers.some(function(d) {
          return d.indexOf('driver2.js') !== -1;
        }));

        done();
      }
    });
  });

  it('returns an empty array if no related drivers were found', function(done) {
    findDriver({
      filename: __dirname + '/example/zombie.js',
      directory: __dirname + '/example',
      success: function(err, drivers) {
        assert(!err);
        assert(!drivers.length);
        done();
      }
    });
  });

  it('throws if a filename is not supplied', function() {
    assert.throws(function() {
      findDriver({
        directory: __dirname + '/example',
        success: function() {}
      });
    });
  });

  it('throws if a directory is not supplied', function() {
    assert.throws(function() {
      findDriver({
        filename: __dirname + '/example/zombie.js',
        success: function() {}
      });
    });
  });

  it('throws if a success callback is not supplied', function() {
    assert.throws(function() {
      findDriver({
        filename: __dirname + '/example/zombie.js',
        directory: __dirname + '/example'
      });
    });
  });
});