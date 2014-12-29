# module-definition [![npm](http://img.shields.io/npm/v/module-definition.svg)](https://npmjs.org/package/module-definition) [![npm](http://img.shields.io/npm/dm/module-definition.svg)](https://npmjs.org/package/module-definition)

Determines the module definition type (CommonJS, AMD, ES6, or none) for a given JavaScript file
by walking through the AST.

`npm install module-definition`

### Usage

```javascript
var getModuleType = require('module-definition');

// Async
getModuleType('myscript.js', function (err, type) {
  console.log(type);
});

// Sync
var type = getModuleType.sync('myscript.js');
console.log(type);

// From source
var type = getModuleType.fromSource('define({foo: "foo"});');
console.log(type);
```

Or via shell command (requires a global install: `npm install -g module-definition`)
```
module-definition filename
```

Passes one of the following strings to the given callback or returns the string in sync api:

* amd
* commonjs
* es6
* none
