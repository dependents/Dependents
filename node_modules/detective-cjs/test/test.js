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
    assert(deps.length === 2);
  });

  it('returns an empty list if there are no dependencies', function() {
    var deps = detective('1 + 1;');
    assert(!deps.length);
  });

  it('accepts an AST', function() {
    var deps = detective(ast);
    assert(deps.length === 1);
    assert(deps[0] === './a');
  });

  it('calls escodegen generate for non-literal require arguments (#1)', function() {
    sinon.spy(escodegen, 'generate');
    detective('var a = require("./foo" + "bar");');
    assert(escodegen.generate.called);
    escodegen.generate.restore();
  });
});
