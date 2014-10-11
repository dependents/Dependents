var dependents = require('../'),
    assert = require('assert');

describe('dependents', function() {
  it('returns the (non-aliased) modules that depend on the given module', function(done) {
    dependents.for({
      filename: __dirname + '/example/b.js',
      directory: __dirname + '/example',
      success: function(dependents) {
        assert(dependents.length === 1);
        assert(dependents[0].indexOf('a.js') !== -1);
        done();
      }
    });
  });

  it('properly resolves aliased modules if given a requirejs config', function(done) {
    dependents.for({
      filename: __dirname + '/example/b.js',
      directory: __dirname + '/example',
      config: __dirname + '/example/config.json',
      success: function(dependents) {
        assert(dependents.length === 2);
        assert(dependents[0].indexOf('a.js') !== -1);
        assert(dependents[1].indexOf('c.js') !== -1);
        done();
      }
    });
  });
});
