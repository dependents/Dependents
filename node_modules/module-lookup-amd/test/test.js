var assert = require('assert');
var path = require('path');
var ConfigFile = require('requirejs-config-file').ConfigFile;
var lookup = require('../');

var dir = '/path/from/my/machine/js';
var filename = dir + '/poet/Remote.js';
var configPath = __dirname + '/example/config.json';

describe('lookup', function() {
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
});
