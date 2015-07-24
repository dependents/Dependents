#### detective-cjs [![npm](http://img.shields.io/npm/v/detective-cjs.svg)](https://npmjs.org/package/detective-cjs) [![npm](http://img.shields.io/npm/dm/detective-cjs.svg)](https://npmjs.org/package/detective-cjs)

> Get the dependencies of an CommonJS module

`npm install detective-cjs`

But bro, substack already built this (node-detective). Yes, but I needed the capability to reuse an AST
and this was unlikely to be merged timely.

### Usage

```js
var detective = require('detective-cjs');

var mySourceCode = fs.readFileSync('myfile.js', 'utf8');

// Pass in a file's content or an AST
var dependencies = detective(mySourceCode);

```

#### License

MIT
