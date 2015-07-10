### callers [![npm](http://img.shields.io/npm/v/callers.svg)](https://npmjs.org/package/callers) [![npm](http://img.shields.io/npm/dm/callers.svg)](https://npmjs.org/package/callers)

> Get the modules that call a function of another module

`npm install callers`

### Usage

```js
var callers = require('callers');

callers({
  filename: 'file/that/has/the/function',
  functionName: 'foobar',
  directory: 'path/to/all/js/files',
  success: function(err, callers) {

  }
});
```

* You can also pass optional arguments through to node-dependents
like [`config` and `exclude`](https://github.com/mrjoelkemp/node-dependents#optional).

### CLI

* requires a global install

`callers [options] <filename> <functionName>`

* `callers --help` for supported options