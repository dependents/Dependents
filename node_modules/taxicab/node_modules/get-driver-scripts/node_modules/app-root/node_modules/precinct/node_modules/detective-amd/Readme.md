# Detective-AMD [![npm](http://img.shields.io/npm/v/detective-amd.svg)](https://npmjs.org/package/detective-amd) [![npm](http://img.shields.io/npm/dm/detective-amd.svg)](https://npmjs.org/package/detective-amd)

Returns a list of dependencies for a given JavaScript file using
any of the AMD module syntaxes.

*Inspired by substack/node-detective but built for AMD*

`npm install detective-amd`

### Usage

Let's say we have the following file definitions:

```javascript

// a.js
define(['./b', './c'], function (b, c) {
  console.log(b, c);
});

// b.js
define({
  name: 'foo'
});

// c.js
define(function () {
  return 'bar';
});

```

Here's how you can grab the list of dependencies of `a.js` **synchronously**.

```javascript
var getDependencies = require('detective-amd');

var srca = fs.readFileSync('a.js');
var srcb = fs.readFileSync('b.js');
var srcc = fs.readFileSync('c.js');

// Pass in the source code as a string
console.log(getDependencies(srca)); // prints ['./b', './c']
console.log(getDependencies(srcb)); // prints []
console.log(getDependencies(srcc)); // prints []

```
### Notes

**Supports the 4 forms of AMD syntax:**

* "named": `define('name', [deps], func)`
* "dependency list": `define([deps], func)`
* "factory": `define(func(require))`
* "no dependencies": `define({})`

Also supports "driver script" syntax:

`require([deps], func)`

Also handles dynamically loaded dependencies (ex: inner requires).

Also handles REM form: `define(function(require, exports, module) {})`.

**Supports driver scripts**

You can also find the dependencies from a script that has a top-level require (an app initialization/driver/entry-point script):

```javascript
require([
  './a'
], function (a) {
  // My app will get booted up from here
});
```

**Expression-based requires**

If there's a require call that doesn't have a string literal but an expression,
a string (escodegen-generated) representation will be returned.

For example, if `a.js` was of the "factory" form and contained a dynamic module name:

```javascript
// a.js

define(function (require) {
  // Assume str is some variable that gets set to a string dynamically
  // var str = ...

  var b = require('./' + str),
      c = require('./c');

  console.log(b, c);
});
```

The dependency list will be: `[ '\'./\' + str', './c' ]`

* Even though that string representation isn't incredibly useful, it's
still added to the list to represent/count that dependency
