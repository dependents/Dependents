### is-calling-function [![npm](http://img.shields.io/npm/v/is-calling-function.svg)](https://npmjs.org/package/is-calling-function) [![npm](http://img.shields.io/npm/dm/is-calling-function.svg)](https://npmjs.org/package/is-calling-function)

> Whether or not a file is calling a particular function

`npm install is-calling-function`

### Usage

```js
var isCallingFunction = require('is-calling-function');

var result = isCallingFunction(source, functionName);
```

* Note: you can also pass an AST as the source for reuse and to avoid double-parsing.
* Handles function declarations, function member expressions, and IIFEs

Shell usage (requires global install `-g`)

`is-calling-function filename functionName`