var getDependencies = require('../'),
    fs     = require('fs'),
    assert = require('assert'),
    path   = require('path');

describe('detective-amd', function() {
  function getDepsOf(filepath) {
    var src = fs.readFileSync(path.resolve(__dirname, filepath), 'utf8');
    return getDependencies(src);
  }

  it('accepts an AST', function() {
    var amdAST = {
      type: 'Program',
      body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'CallExpression',
          callee: {
              type: 'Identifier',
              name: 'define'
          },
          arguments: [
            {
              type: 'ArrayExpression',
              elements: []
            },
            {
              type: 'FunctionExpression',
              id: null,
              params: [],
              defaults: [],
              body: {
                type: 'BlockStatement',
                body: []
              },
              rest: null,
              generator: false,
              expression: false
          }]
        }
      }]
    };
    var deps = getDependencies(amdAST);
    assert(!deps.length);
  });

  it('supports es6', function() {
    assert.doesNotThrow(function() {
      getDependencies('define({ foo() {}});');
    });
  });

  it('returns the dependencies of the factory form', function() {
    var deps = getDepsOf('./amd/factory.js');
    assert(deps.length === 2);
    assert(deps[0] === './b');
    assert(deps[1] === './c');
  });

  it('returns the an empty list for the no dependency form', function() {
    var deps = getDepsOf('./amd/nodep.js');
    assert(deps.length === 0);
  });

  it('returns the dependencies of the named form', function() {
    var deps = getDepsOf('./amd/named.js');
    assert(deps.length === 1);
    assert(deps[0] === 'a');
  });

  it('returns the dependencies of the dependency form', function() {
    var deps = getDepsOf('./amd/dep.js');
    assert(deps.length === 2);
    assert(deps[0] === './a');
    assert(deps[1] === './b');
  });

  it('returns the dependencies for the REM form (#2)', function() {
    var deps = getDepsOf('./amd/rem.js');
    assert(deps.length === 2);
    assert(deps[0] === 'a');
    assert(deps[1] === 'b');
  });

  it('returns the emtpy list for non-amd modules', function() {
    var deps = getDepsOf('./amd/empty.js');
    assert(!deps.length);
  });

  it('returns the dependencies of a driver script', function() {
    var deps = getDepsOf('./amd/driver.js');
    assert(deps.length === 1);
    assert(deps[0] === './a');
  });

  it('includes dynamic requires as dependencies', function() {
    var deps = getDepsOf('./amd/dynamicRequire.js');
    assert(deps.length === 2);
    assert(deps[0] === './a');
    assert(deps[1] === './b');
  });

  it('handles nested driver scripts', function() {
    var deps = getDepsOf('./amd/IIFEWithDriver.js');
    assert(deps.length === 2);
    assert(deps[0] === 'a');
    assert(deps[1] === 'b');
  });
});
