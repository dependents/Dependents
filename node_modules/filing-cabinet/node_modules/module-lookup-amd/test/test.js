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
    directory = '/path/from/my/machine/js';
    filename = directory + '/poet/Remote.js';
    config = __dirname + '/example/config.json';
  });

  it('returns the real path of an aliased module given a path to a requirejs config file', function() {
    assert.equal(lookup({
      config,
      partial: 'a',
      filename
    }), path.join(directory, 'foo/a'));
  });

  it('returns the looked up path given a loaded requirejs config object', function() {
    var configObject = new ConfigFile(config).read();
    assert.equal(lookup({
      config: configObject,
      partial: 'foobar',
      filename
    }), path.join(directory, 'foo/bar/b'));
  });

  it('supports paths that use plugin loaders', function() {
    assert.equal(lookup({
      config,
      partial: 'hgn!templates/a',
      filename
    }), path.join(directory, '../templates/a'));
  });

  it('supports relative plugin loader paths', function() {
    // templates should path lookup to ../templates
    assert.equal(lookup({
      config,
      partial: 'hgn!./templates/a',
      filename
    }), path.join(directory, '../templates/poet/a'));

    assert.equal(lookup({
      config,
      partial: 'text!./templates/a.mustache',
      filename
    }), path.join(directory, '../templates/poet/a.mustache'));
  });

  it('supports map aliasing', function() {
    assert.equal(lookup({
      config,
      partial: 'hgn!./templates/_icons/_embed',
      filename
    }), path.join(directory, '../templates/poet/_icons/_embed'));
  });

  it('supports relative pathing', function() {
    assert.equal(lookup({
      config,
      partial: 'hgn!./templates/_icons/_embed',
      filename
    }), path.join(directory, '../templates/poet/_icons/_embed'));
  });

  it('returns the same dependency if not aliased', function() {
    assert.equal(lookup({
      config,
      partial: 'my/sweet/path',
      filename
    }), path.join(directory, 'my/sweet/path'));
  });

  it('does not throw if the config is missing', function() {
    assert.doesNotThrow(function() {
      lookup({
        partial: 'foobar',
        filename
      });
    });
  });

  it('does not throw if the baseUrl is missing', function() {
    var configObject = new ConfigFile(config).read();
    delete configObject.baseUrl;

    assert.doesNotThrow(function() {
      lookup({
        config: configObject,
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
        partial: 'foobar',
        filename
      });
    });
  });

  describe('when no baseUrl is in the config', function() {
    it('defaults the baseUrl to the directory of the config file', function() {
      var stub = sinon.stub().returns('');
      var revert = lookup.__set__('normalize', stub);

      sinon.stub(lookup, '_readConfig').returns({baseUrl: undefined});

      lookup({
        config,
        partial: 'foobar',
        filename
      });

      // Add the slash since we normalize the slash during the lookup
      assert.equal(stub.args[0][2].baseUrl, path.dirname(config) + '/');
      revert();
    });

    it('defaults to ./ if the config was a reused object', function() {
      var configObject = new ConfigFile(config).read();
      delete configObject.baseUrl;

      var stub = sinon.stub().returns('');

      var revert = lookup.__set__('normalize', stub);

      lookup({
        config: configObject,
        partial: 'foobar',
        filename
      });

      assert.equal(stub.args[0][2].baseUrl, './');
      revert();
    });
  });

  describe('when a filepath is not within the base url', function() {
    it('does not throw', function() {
      assert.doesNotThrow(function() {
        lookup({
          config,
          partial: 'my/sweet/path',
          filename: '/some/random/folder/foo.js'
        });
      });
    });

    it('returns an empty string if a directory is not given', function() {
      assert.equal(lookup({
        config,
        partial: 'my/sweet/path',
        filename: '/some/random/folder/foo.js'
      }), '');
    });

    it('returns the normalized path about the given directory and the base url', function() {
      assert.equal(lookup({
        config,
        partial: 'my/sweet/path',
        filename: '/some/random/folder/foo.js',
        directory: '/some/random/folder/'
      }), '/some/random/folder/my/sweet/path');
    });
  });
});
