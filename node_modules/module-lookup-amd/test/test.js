var assert = require('assert');
var path = require('path');
var ConfigFile = require('requirejs-config-file').ConfigFile;
var rewire = require('rewire');
var sinon = require('sinon');

var lookup = rewire('../');

var directory;
var filename;
var config;

describe('lookup', function() {
  beforeEach(function() {
    directory = __dirname + '/example/js';
    filename = directory + '/a.js';
    config = __dirname + '/example/config.json';
  });

  it('returns the real path of an aliased module given a path to a requirejs config file', function() {
    assert.equal(lookup({
      config,
      partial: 'b',
      filename
    }), path.join(directory, 'b.js'));
  });

  it('resolves relative paths about the baseUrl, not the module', function() {
    assert.equal(lookup({
      config,
      partial: './c',
      filename: `${directory}/subdir/a.js`,
    }), path.join(directory, 'c.js'));
  });

  it('returns the looked up path given a loaded requirejs config object', function() {
    var configObject = new ConfigFile(config).read();
    assert.equal(lookup({
      config: configObject,
      configPath: config,
      partial: 'foobar',
      filename
    }), path.join(directory, 'b.js'));
  });

  it('supports paths that use plugin loaders', function() {
    assert.equal(lookup({
      config,
      partial: 'hgn!templates/a',
      filename
    }), path.join(directory, '../templates/a.mustache'));
  });

  it('supports relative plugin loader paths', function() {
    // templates should path lookup to ../templates
    assert.equal(lookup({
      config,
      partial: 'hgn!./templates/a',
      filename
    }), path.join(directory, '../templates/a.mustache'));
  });

  it('supports plugin loader usage with the full extension', function() {
    assert.equal(lookup({
      config,
      partial: 'text!./templates/a.mustache',
      filename
    }), path.join(directory, '../templates/a.mustache'));
  });

  it('supports map aliasing', function() {
    assert.equal(lookup({
      config,
      partial: 'hgn!inner/templates/b',
      filename
    }), path.join(directory, '../templates/inner/b.mustache'));
  });

  it('does not throw if the config is missing', function() {
    assert.doesNotThrow(function() {
      lookup({
        partial: 'b',
        filename
      });
    });
  });

  it('properly resolves files with the .min.js extension', function() {
    assert.equal(lookup({
      config,
      partial: 'jquery',
      filename: `${directory}/subdir/a.js`,
    }), path.join(directory, 'vendor/jquery.min.js'));
  });

  it('does not confuse minified and unminified files in the same dir', function() {
    assert.notEqual(lookup({
      config,
      partial: 'jquery',
      filename: `${directory}/subdir/a.js`,
    }), path.join(directory, 'vendor/jquery.js'));
  });

  it('resolves style imports', function() {
    assert.equal(lookup({
      config,
      partial: 'css!styles/myStyles',
      filename: `${directory}/subdir/a.js`,
    }), path.join(directory, '../styles/myStyles.css'));
  });

  it('does not throw if the baseUrl is missing', function() {
    var configObject = new ConfigFile(config).read();
    delete configObject.baseUrl;

    assert.doesNotThrow(function() {
      lookup({
        config: configObject,
        configPath: config,
        partial: 'foobar',
        filename
      });
    });
  });

  it('does not throw if config.map is missing', function() {
    var configObject = new ConfigFile(config).read();
    delete configObject.map;

    assert.doesNotThrow(function() {
      lookup({
        config: configObject,
        configPath: config,
        partial: 'foobar',
        filename
      });
    });
  });

  it('does not throw if config.paths is missing', function() {
    var configObject = new ConfigFile(config).read();
    delete configObject.paths;

    assert.doesNotThrow(function() {
      lookup({
        config: configObject,
        configPath: config,
        partial: 'foobar',
        filename
      });
    });
  });

  it('does not throw if the partial doesn\'t resolve to a file', function() {
    assert.doesNotThrow(() => {
      lookup({
        config,
        partial: 'foo/bar',
        filename: `${directory}/subdir/a.js`,
      });
    });
  });

  describe('when no baseUrl is in the config', function() {
    describe('and a configPath is supplied', function() {
      it('defaults the directory containing the config file', function() {
        var configObject = new ConfigFile(config).read();
        delete configObject.baseUrl;

        assert.equal(lookup({
          config: configObject,
          configPath: config,
          partial: 'forNoBaseUrl',
          filename
        }), path.join(directory, '../forNoBaseUrl.js'));
      });
    });

    describe('and the configPath was not supplied', function() {
      it('defaults to the directory containing the given file', function() {
        var configObject = new ConfigFile(config).read();
        delete configObject.baseUrl;

        assert.equal(lookup({
          config: configObject,
          partial: 'b',
          filename
        }), path.join(directory, 'b.js'));
      });
    });
  });

  describe('when a filename is not within the base url', function() {
    it('still resolves the partial', function() {
      assert.equal(lookup({
        config,
        partial: 'b',
        filename: __dirname + '/test.js'
      }), path.join(directory, 'b.js'));
    });
  });
});
