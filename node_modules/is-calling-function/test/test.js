var assert = require('assert');
var isCallingFunction = require('../');

describe('is-calling-function', function() {
  it('returns true if the file calls the given function name', function() {
    assert.ok(isCallingFunction('foo();', 'foo'));
    assert.ok(isCallingFunction('bar();\nfoo();', 'foo'));
  });

  it('works for function calls on objects', function() {
    assert.ok(isCallingFunction('a.foo();', 'foo'));
  });

  it('works for es6', function() {
    assert.ok(isCallingFunction('() => foo();', 'foo'));
  });

  it('works for named iife', function() {
    assert.ok(isCallingFunction('(function foo(){})();', 'foo'));
  });

  it('returns false if the file does not call the function name', function() {
    assert.ok(!isCallingFunction('bar();', 'foo'));
    assert.ok(!isCallingFunction('car();', 'foo'));
    assert.ok(!isCallingFunction('var foo = 1;', 'foo'));
  });

  it('throws if a filename is not given', function() {
    assert.throws(function() {
      isCallingFunction(undefined, 'foo');
    });
  });

  it('throws if a function name is not given or blank', function() {
    assert.throws(function() {
      isCallingFunction('foo();', '');
    });

    assert.throws(function() {
      isCallingFunction('foo();', undefined);
    });
  });

  it('works for es6 modules', function() {
    assert.ok(isCallingFunction('let bar = 1; \nfoo();', 'foo'));
  });
});
