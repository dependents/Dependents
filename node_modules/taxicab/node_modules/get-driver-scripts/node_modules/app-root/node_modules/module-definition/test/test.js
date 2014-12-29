var getModuleType = require('../'),
    path = require('path'),
    fs = require('fs'),
    assert = require('assert'),

    expected = {
      './cjsExport.js': 'commonjs',
      './cjsRequire.js': 'commonjs',
      './amdNoDep.js': 'amd',
      './iife.js': 'none',
      './amdFactory.js': 'amd',
      './amdDeps.js': 'amd',
      './cjsTopRequire.js': 'commonjs',
      './empty.js': 'none',
      './amdREM.js': 'amd',
      './es6Import.js': 'es6',
      './es6Export.js': 'es6'
    };

function testMethodAgainstExpected(method) {
  Object.keys(expected).forEach(function(file) {
    method(file, expected[file]);
  });
}

function asyncTest(filename, result) {
  it('should return `' + result + '` as type of ' + filename, function(done) {
    getModuleType(path.resolve(__dirname, filename), function(error, type) {
      assert.strictEqual(error, null, error);
      assert.equal(type, result);
      done();
    });
  });
}

function syncTest(filename, result) {
  it('should return `' + result + '` as type of ' + filename, function() {
    var type = getModuleType.sync(path.resolve(__dirname, filename));
    assert.equal(type, result);
  });
}

function sourceTest(filename, result) {
  it('should return `' + result + '` as type of ' + filename, function() {
    var source = fs.readFileSync(path.resolve(__dirname, filename)),
        type = getModuleType.fromSource(source);
    assert.equal(type, result);
  });
}

describe('Async tests', function() {
  testMethodAgainstExpected(asyncTest);

  it('should report an error for non-existing file', function(done) {
    getModuleType('no_such_file', function(error, type) {
      assert.notStrictEqual(error, null);
      // ENOENT errors always contains filename
      assert.notEqual(error.toString().indexOf('no_such_file'), -1, error);
      done();
    });
  });

  it('should report an error for file with syntax error', function(done) {
    getModuleType(path.resolve(__dirname, 'j.js'), function(error, type) {
      assert.notStrictEqual(error, null);
      // Check error not to be ENOENT
      assert.equal(error.toString().indexOf('j.js'), -1, error);
      done();
    });
  });

  it('should throw an error if argument is missing', function() {
    assert.throws(function() {
      getModuleType(path.resolve(__dirname, 'a.js'));
    }, /callback/);
    assert.throws(function() {
      getModuleType();
    }, /filename/);
  });
});

describe('Sync tests', function() {
  testMethodAgainstExpected(syncTest);

  it('should throw an error if argument is missing', function() {
    assert.throws(function() {
      getModuleType.sync();
    }, /filename/);
  });
});

describe('From source tests', function() {
  testMethodAgainstExpected(sourceTest);

  it('should throw an error if argument is missing', function() {
    assert.throws(function() {
      getModuleType.fromSource();
    }, /source/);
  });
});
