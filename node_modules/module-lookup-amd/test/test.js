var assert = require('assert');
var path = require('path');
var ConfigFile = require('requirejs-config-file').ConfigFile;
var rewire = require('rewire');
var sinon = require('sinon');

var lookup = rewire('../');

var dir;
var filename;
var configPath;

describe('lookup', function() {
  beforeEach(function() {
    dir = '/path/from/my/machine/js';
    filename = dir + '/poet/Remote.js';
    configPath = __dirname + '/example/config.json';
  });

  it('returns the real path of an aliased module given a path to a requirejs config file', function() {
    assert.equal(lookup(configPath, 'a', filename), path.join(dir, 'foo/a'));
  });

  it('returns the looked up path given a loaded requirejs config object', function() {
    var configObject = new ConfigFile(configPath).read();
    assert.equal(lookup(configObject, 'foobar', filename), path.join(dir, 'foo/bar/b'));
  });

  it('supports paths that use plugin loaders', function() {
    assert.equal(lookup(configPath, 'hgn!templates/a', filename), path.join(dir, '../templates/a'));
  });

  it('supports relative plugin loader paths', function() {
    // templates should path lookup to ../templates
    assert.equal(lookup(configPath, 'hgn!./templates/a', filename), path.join(dir, '../templates/poet/a'));
    assert.equal(lookup(configPath, 'text!./templates/a.mustache', filename), path.join(dir, '../templates/poet/a.mustache'));
  });

  it('supports map aliasing', function() {
    assert.equal(lookup(configPath, 'hgn!./templates/_icons/_embed', filename), path.join(dir, '../templates/poet/_icons/_embed'));
  });

  it('supports relative pathing', function() {
    assert.equal(lookup(configPath, 'hgn!./templates/_icons/_embed', filename), path.join(dir, '../templates/poet/_icons/_embed'));
  });

  it('returns the same dependency if not aliased', function() {
    assert.equal(lookup(configPath, 'my/sweet/path', filename), path.join(dir, 'my/sweet/path'));
  });

  it('does not throw if the baseUrl is missing', function() {
    var configObject = new ConfigFile(configPath).read();
    delete configObject.baseUrl;

    assert.doesNotThrow(function() {
      lookup(configObject, 'foobar', filename);
    });
  });

  it('does not throw if config.map is missing', function() {
    var configObject = new ConfigFile(configPath).read();
    delete configObject.map;

    assert.doesNotThrow(function() {
      lookup(configObject, 'foobar', filename);
    });
  });

  it('does not throw if config.paths is missing', function() {
    var configObject = new ConfigFile(configPath).read();
    delete configObject.paths;

    assert.doesNotThrow(function() {
      lookup(configObject, 'foobar', filename);
    });
  });

  describe('when no baseUrl is in the config', function() {
    it('defaults the baseUrl to the directory of the config file', function() {
      var stub = sinon.stub().returns('');
      var revert = lookup.__set__('normalize', stub);

      sinon.stub(lookup, '_readConfig').returns({baseUrl: undefined});

      lookup(configPath, 'foobar', filename);

      // Add the slash since we normalize the slash during the lookup
      assert.equal(stub.args[0][2].baseUrl, path.dirname(configPath) + '/');
      revert();
    });

    it('defaults to ./ if the config was a reused object', function() {
      var configObject = new ConfigFile(configPath).read();
      delete configObject.baseUrl;

      var stub = sinon.stub().returns('');

      var revert = lookup.__set__('normalize', stub);

      lookup(configObject, 'foobar', filename);

      assert.equal(stub.args[0][2].baseUrl, './');
      revert();
    });
  });

  describe('when a filepath is not within the base url', function() {
    it('does not throw', function() {
      assert.doesNotThrow(function() {
        lookup(configPath, 'my/sweet/path', '/some/random/folder/foo.js');
      })
    });

    it('returns an empty string if a directory is not given', function() {
      assert.equal(lookup(configPath, 'my/sweet/path', '/some/random/folder/foo.js'), '');
    });

    it('returns the normalized path about the given directory and the base url', function() {
      assert.equal(lookup(configPath, 'my/sweet/path', '/some/random/folder/foo.js', '/some/random/folder/'), '/some/random/folder/my/sweet/path');
    });
  });
});
