var dependents = require('../');
var assert = require('assert');
var defaultExclusions = require('../lib/util').DEFAULT_EXCLUDE_DIR;
var sinon = require('sinon');

describe('dependents', function() {
  it('does not throw on esprima errors', function(done) {
    dependents.for({
      filename: __dirname + '/example/error.js',
      directory: __dirname + '/example',
      success: function(dependents) {
        assert(!dependents.length);
        done();
      }
    });
  });

  it('reuses a given configuration object config', function(done) {
    var config = dependents._readConfig(__dirname + '/example/amd/config.json');
    var spy = sinon.spy(dependents, '_readConfig');

    dependents.for({
      filename: __dirname + '/example/error.js',
      directory: __dirname + '/example',
      config: config,
      success: function(dependents) {
        assert(!spy.called);
        done();
      }
    });
  });

  describe('exclusions', function() {
    it('excludes common 3rd party folders by default', function(done) {
      dependents.for({
        filename: __dirname + '/example/exclusions/a.js',
        directory: __dirname + '/example/exclusions',
        success: function(dependents) {
          assert(!dependents.some(function(dependent) {
            return defaultExclusions.indexOf(dependents) !== -1;
          }));
          done();
        }
      });
    });

    it('excludes custom folders', function(done) {
      dependents.for({
        filename: __dirname + '/example/exclusions/a.js',
        directory: __dirname + '/example/exclusions',
        exclusions: ['customExclude'],
        success: function(dependents) {
          assert(!dependents.some(function(dependent) {
            return dependent.indexOf('customExclude') !== -1;
          }));
          done();
        }
      });
    });

    it('cannot exclude particular subdirectories', function(done) {
      // node-dir looks at a directory name at a time, not partial paths
      dependents.for({
        filename: __dirname + '/example/exclusions/a.js',
        directory: __dirname + '/example/exclusions',
        exclusions: ['customExclude/subdir'],
        success: function(dependents) {
          assert(dependents.some(function(dependent) {
            return dependent.indexOf('customExclude/subdir') !== -1;
          }));
          done();
        }
      });
    });
  });

  describe('amd', function() {
    it('returns the (non-aliased) dependents', function(done) {
      dependents.for({
        filename: __dirname + '/example/amd/b.js',
        directory: __dirname + '/example/amd',
        success: function(dependents) {
          assert(dependents.length === 1);
          assert(dependents[0].indexOf('a.js') !== -1);
          done();
        }
      });
    });

    it('resolves aliased modules if given a requirejs config', function(done) {
      dependents.for({
        filename: __dirname + '/example/amd/b.js',
        directory: __dirname + '/example/amd',
        config: __dirname + '/example/amd/config.json',
        success: function(dependents) {
          assert(dependents.length === 2);
          assert(dependents[0].indexOf('a.js') !== -1);
          assert(dependents[1].indexOf('c.js') !== -1);
          done();
        }
      });
    });
  });

  describe('commonjs', function() {
    it('finds the dependents of commonjs modules', function(done) {
      dependents.for({
        filename: __dirname + '/example/commonjs/b.js',
        directory: __dirname + '/example/commonjs',
        success: function(dependents) {
          assert(dependents.length);
          done();
        }
      });
    });

    it('handles relative dependencies', function(done) {
      dependents.for({
        filename: __dirname + '/example/commonjs/b.js',
        directory: __dirname + '/example/commonjs',
        success: function(dependents) {
          assert(dependents.some(function(d) {
            return d.indexOf('c.js') !== -1;
          }));
          done();
        }
      });
    });
  });

  describe('es6', function() {
    it('finds the dependents of es6 modules', function(done) {
      dependents.for({
        filename: __dirname + '/example/es6/b.js',
        directory: __dirname + '/example/es6',
        success: function(dependents) {
          assert(dependents.length);
          done();
        }
      });
    });
  });

  describe('sass', function() {
    it('finds the dependents of sass files', function(done) {
      dependents.for({
        filename: __dirname + '/example/sass/_foo.scss',
        directory: __dirname + '/example/sass',
        success: function(dependents) {
          assert(dependents.length === 2);
          done();
        }
      });
    });
  });
});
