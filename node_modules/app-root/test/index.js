var getAppRoot = require('../');
var assert = require('assert');
var extend = require('object-assign');

describe('app-root', function() {
  var options = {
    ignoreDirectories: ['bower_components'],
    ignoreFiles: ['index.js']
  };

  it('omits no dependency modules by default', function(done) {
    var opts = {
      directory: __dirname + '/apps/commonjs',
      success: function(root) {
        assert(!root.some(function(r) {
          return r.indexOf('noDep.js') !== -1;
        }));
        done();
      }
    };

    getAppRoot(opts);
  });

  describe('includeNoDependencyModules', function() {
    it('includes no dependency modules if set', function(done) {
      var opts = {
        directory: __dirname + '/apps/commonjs',
        includeNoDependencyModules: true,
        success: function(root) {
          assert(root.some(function(r) {
            return r.indexOf('noDep.js') !== -1;
          }));
          done();
        }
      };

      getAppRoot(opts);
    });
  });

  describe('ignoreDirectories', function() {
    it('does not ignore any directories by default', function(done) {
      var opts = {
        directory: __dirname + '/apps/amd',
        success: function(root) {
          assert(root.some(function(r) {
            return r.indexOf('bower_components') !== -1;
          }));
          done();
        }
      };

      getAppRoot(opts);
    });

    it('ignores processing files within supplied directories', function(done) {
      var opts = {
        directory: __dirname + '/apps/amd',
        ignoreDirectories: options.ignoreDirectories,
        success: function(root) {
          assert(!root.some(function(r) {
            return r.indexOf('bower_components') !== -1;
          }));
          done();
        }
      };

      getAppRoot(opts);
    });
  });

  it('throws if a directory is not supplied', function() {
    assert.throws(function() {
      getAppRoot();
    });
  });

  it('throws if a success callback is not supplied', function() {
    assert.throws(function() {
      getAppRoot({
        directory: __dirname
      });
    });
  });

  // There is confusion around which loader to use with files that
  // have both a requirejs and webpack config.
  it.skip('finds the roots of an entire directory of multiple apps', function(done) {
    var opts = {
      directory: __dirname + '/apps',
      config: __dirname + '/apps/amd/config.json',
      success: function(roots) {
        // Equal to the number of apps within /apps/
        assert.equal(roots.length, 4);
        done();
      }
    };

    extend(opts, options);

    getAppRoot(opts);
  });

  describe('commonjs', function() {
    it('finds the roots of a commonjs app', function(done) {
      var opts = {
        directory: __dirname + '/apps/commonjs',
        success: function(root) {
          assert.equal(root.length, 1);
          assert.ok(root[0].indexOf('a2.js') !== -1);
          done();
        }
      };

      extend(opts, options);

      getAppRoot(opts);
    });
  });

  describe('amd', function() {
    it('finds the roots of an amd app', function(done) {
      var opts = {
        directory: __dirname + '/apps/amd',
        config: __dirname + '/apps/amd/config.json',
        success: function(root) {
          assert(root.length === 1);
          assert(root[0].indexOf('a2.js') !== -1);
          done();
        }
      };

      extend(opts, options);

      getAppRoot(opts);
    });

    it('handles aliased modules with a supplied config', function(done) {
      var opts = {
        directory: __dirname + '/aliased/js',
        config: __dirname + '/aliased/config.json',
        success: function(root) {
          assert(root.length === 1);
          assert(root[0].indexOf('root.js') !== -1);
          done();
        }
      };

      getAppRoot(opts);
    });
  });

  describe('sass', function() {
    it('finds the roots of a sass codebase', function(done) {
      var opts = {
        directory: __dirname + '/apps/sass',
        success: function(root) {
          assert(root.length === 1);
          assert(root[0].indexOf('root.scss') !== -1);
          done();
        }
      };

      getAppRoot(opts);
    });
  });

  describe('es6', function() {
    it('finds the roots of an es6 codebase', function(done) {
      var opts = {
        directory: __dirname + '/apps/es6',
        success: function(root) {
          assert(root.length === 1);
          assert(root[0].indexOf('root.js') !== -1);
          done();
        }
      };

      getAppRoot(opts);
    });
  });
});
