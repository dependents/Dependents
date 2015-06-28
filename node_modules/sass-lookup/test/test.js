var assert = require('assert');
var mock = require('mock-fs');
var lookup = require('../');

describe('sass-lookup', function() {
  beforeEach(function() {
    mock({
      example: {
        '_foo.scss': 'body { color: purple; }',
        'baz.scss': '@import "_foo";',
        'styles.scss': '@import "_foo";\n@import "baz.scss";',
        stylesUnderscore: '@import "foo";',

        nested: {
          'styles.scss': '@import "a/b/b3";\n@import "a/b/b2";',
          a: {
            'a.scss': '@import "../styles";',
            b: {
              '_b3.scss': '',
              'b.scss': '@import "../../styles";\n@import "../a";',
              'b2.scss': '@import "b";\n@import "b3";'
            }
          }
        }
      }
    });
  });

  afterEach(mock.restore);

  it('handles partials with underscored files', function() {
    assert.equal(lookup('_foo', 'example/baz.scss', 'example'),
      process.cwd() + '/example/_foo.scss');
  });

  it('handles partials with an extension', function() {
    assert.equal(lookup('baz.scss', 'example/styles.scss', 'example'),
      process.cwd() + '/example/baz.scss');
  });

  describe('deeply nested paths', function() {
    it('handles underscored partials', function() {
      assert.equal(lookup('a/b/b3', 'example/nested/styles.scss', 'example'),
        process.cwd() + '/example/nested/a/b/_b3.scss');
    });

    it('handles non-underscored partials', function() {
      assert.equal(lookup('a/b/b2', 'example/nested/styles.scss', 'example'),
        process.cwd() + '/example/nested/a/b/b2.scss');
    });
  });

  describe('relative partials', function() {
    it('handles one level up', function() {
      assert.equal(lookup('../a', 'example/nested/a/b/b.scss', 'example'),
        process.cwd() + '/example/nested/a/a.scss');
    });

    it('handles more than one level up', function() {
      assert.equal(lookup('../../styles', 'example/nested/a/b/b.scss', 'example'),
        process.cwd() + '/example/nested/styles.scss');
    });
  });

  describe('partials within the same subdirectory', function() {
    it('handles non-underscored partials', function() {
      assert.equal(lookup('b', 'example/nested/a/b/b2.scss', 'example'),
        process.cwd() + '/example/nested/a/b/b.scss');
    });

    it('handles underscored partials', function() {
      assert.equal(lookup('b3', 'example/nested/a/b/b2.scss', 'example'),
        process.cwd() + '/example/nested/a/b/_b3.scss');
    });
  });
});
