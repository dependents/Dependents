var justParse = require('../');

var assert = require('assert');
var fs = require('fs');
var sinon = require('sinon');

describe('just-parse', function() {
  it('ignores unparsable .js files', function() {
    assert.doesNotThrow(function() {
      justParse(fs.readFileSync(__dirname + '/example/unparseable.js', 'utf8'));
    }, SyntaxError);
  });

  it('parses es6 modules even with small errors', function() {
    var filePath = __dirname + '/example/es6WithError.js';
    var ast  = justParse(fs.readFileSync(filePath, 'utf8'));
    assert(ast instanceof Object);
  });

  it('parses just fine', function() {
    var filePath = __dirname + '/example/valid.js';
    var ast = justParse(fs.readFileSync(filePath, 'utf8'));
    assert(ast instanceof Object);
  });

  it('should parse scripts even with a source type of module', function() {
    var stub = sinon.stub(justParse, '_getParserOptions').returns({
      ecmaVersion: 6,
      sourceType: 'module'
    });

    var ast = justParse('#!/usr/bin/env node\nvar foo = 1;');
    assert(ast instanceof Object);
    stub.restore();
  });

  it.skip('does not hang on ios includes', function() {
    var ast = justParse(fs.readFileSync(__dirname + '/example/ios_includes.js', 'utf8'));
    assert(ast instanceof Object);
  });

  it('parses es6 imports', function() {
    var ast = justParse('import "foo" from "bar";');
    assert(ast instanceof Object);
  });
});
