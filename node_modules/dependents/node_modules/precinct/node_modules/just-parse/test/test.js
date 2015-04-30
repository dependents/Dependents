var justParse = require('../');

var assert = require('assert');
var fs = require('fs');

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
});
