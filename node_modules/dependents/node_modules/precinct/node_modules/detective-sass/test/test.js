var detective = require('../');
var assert = require('assert');

describe('detective-sass', function() {
  function hasDependencies(source) {
    var deps = detective(source);
    assert(deps.length);
  }

  it('returns the dependencies of the given SASS content', function() {
    hasDependencies('@import "_foo.scss";');
    hasDependencies('@import "_foo";');
    hasDependencies('body { color: blue; } @import "_foo";');
    hasDependencies('@import "bar";');
    hasDependencies('@import \'bar\';');
    hasDependencies('@import \'bar.scss\';');
    hasDependencies('@import "_foo.scss";\n@import "_bar.scss";');
    hasDependencies('@import "_foo.scss";\n@import "_bar.scss";\n@import "_baz";\n@import "_buttons";');
  });
});
