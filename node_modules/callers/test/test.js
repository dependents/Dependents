var assert = require('assert');
var callers = require('../');

describe('callers', function() {
  var dir = __dirname + '/example';

  it('returns the dependents of the file that call a function', function(done) {
    callers({
      filename: dir + '/b.js',
      functionName: 'foobar',
      directory: dir,
      success: function(err, callers) {
        assert(!err);
        assert(callers.some(function(c) {
          return c.indexOf('a.js') !== -1;
        }));
        done();
      }
    });
  });

  it('returns an empty list if there were no callers', function(done) {
    callers({
      filename: dir + '/b.js',
      functionName: 'barbar',
      directory: dir,
      success: function(err, callers) {
        assert(!err);
        assert(!callers.length);
        done();
      }
    });
  });
});
