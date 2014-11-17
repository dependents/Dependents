### get-amd-module-type

`npm install get-amd-module-type`

### Usage

```js
var getType = require('get-amd-module-type');

var type = getType(astNode);

// or

var type = getType('my/file.js');
```

You can supply an AST node, if you're manually traversing through the AST
and need to check the form of a node.

You can also have the library do the traversal and checking for you by supplying a filename.

