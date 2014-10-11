var getDependencies = require('../'),
    fs     = require('fs'),
    assert = require('assert'),
    path   = require('path');

[
  './amd/a.js',
  './amd/b.js',
  './amd/c.js',
  './amd/d.js',
  './amd/e.js'
].forEach(run);

function run (filepath) {
  var src = fs.readFileSync(path.resolve(__dirname, filepath));
  var deps = getDependencies(src);

  switch(filepath) {
    case './amd/a.js':
      assert(deps.length === 2);
      assert(deps[0] === './b');
      assert(deps[1] === './c');
      break;
    case './amd/b.js':
      assert(deps.length === 0);
      break;
    case './amd/c.js':
      assert(deps.length === 0);
      break;
    case './amd/d.js':
      assert(deps.length === 2);
      break;
    case './amd/e.js':
      assert(deps.length === 0);
      break;
  }
}
