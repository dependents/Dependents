var assert = require('assert');
var detective = require('../');
var sinon = require('sinon');
var escodegen = require('escodegen');

describe('detective-cjs', function() {
  var ast = {
    type: 'Program',
    body: [{
      type: 'VariableDeclaration',
      declarations: [{
        type: 'VariableDeclarator',
        id: {
          type: 'Identifier',
          name: 'a'
        },
        init: {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'require'
          },
          arguments: [{
            type: 'Literal',
            value: './a',
            raw: './a'
          }]
        }
      }],
      kind: 'var'
    }]
  };

  it('returns the dependencies of a commonjs module', function() {
    var deps = detective('var a = require("./a");\n var b = require("./b");');
    assert.equal(deps.length, 2);
  });

  it('supports es6', function() {
    var deps = detective('const a = require("./a");\n let b = require("./b");');
    assert.equal(deps.length, 2);
  });

  it('returns an empty list if there are no dependencies', function() {
    var deps = detective('1 + 1;');
    assert.equal(deps.length, 0);
  });

  it('accepts an AST', function() {
    var deps = detective(ast);
    assert.equal(deps.length, 1);
    assert.equal(deps[0], './a');
  });

  it('calls escodegen generate for non-literal require arguments (#1)', function() {
    sinon.spy(escodegen, 'generate');
    detective('var a = require("./foo" + "bar");');
    assert.ok(escodegen.generate.called);
    escodegen.generate.restore();
  });

  it('does not throw on jsx', function() {
    assert.doesNotThrow(function() {
      detective('var a = require("./foo" + "bar"); var templ = <jsx />');
    });
  });
});
