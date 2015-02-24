Collection of useful helper functions when trying to determine
module type (CommonJS or AMD) properties of an AST node.

**Assumes that you used Esprima to get the AST nodes.**

`npm install ast-module-types`

### API

Each of these takes in a single AST node argument
and returns a boolean.

* `isDefine`: if node matches an AMD `define` function call (defining a module)
* `isRequire`: if node matches a `require` function all (declaring a dependency)
* `isTopLevelRequire`: if node matches a `require` at the very top of the file.
* `isAMDDriverScriptRequire`: if node matches an AMD driver script's require call `require([deps], function)`
* `isExports`: if the node matches CommonJS `module.exports` or `exports` (defining a module)

Detecting the various forms of defining an AMD module

* `isNamedForm`: if the node is a define call of the form: `define('name', [deps], func)`
* `isDependencyForm`: if the node is a define call of the form: `define([deps], func)`
* `isFactoryForm`: if the node is a define call of the form: `define(func(require))`
* `isNoDependencyForm`: if the node is a define call of the form: `define({})`
* `isREMForm`: if the node matches the form: `define(function(require, exports, module){});`

### Usage

```javascript
var types = require('ast-module-types');

// Assume node is some node of an AST that you parsed using esprima
// ...

console.log(types.isDefine(node));
```
