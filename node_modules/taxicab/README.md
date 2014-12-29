### TaxiCab [![npm](http://img.shields.io/npm/v/taxicab.svg)](https://npmjs.org/package/taxicab) [![npm](http://img.shields.io/npm/dm/taxicab.svg)](https://npmjs.org/package/taxicab)

> Find a driver

`npm install -g taxicab`

Finds the application entry points (i.e., driver scripts) that depend on a given module.

### Motivation

In a multi-bundle architecture (where each bundle contains an entry-point/driver-script),
a module gets reused across several bundles. If you're changing a module, it's helpful to know
which apps will be affected.

### Usage

```js
var findDriver = require('taxicab');

findDriver({
  file: 'path/to/a/js/file',
  directory: 'path/to/all/js',
  success: function(err, drivers) {
    console.log(drivers);
  }
});
```

* You may pass additional options supported by [`get-driver-scripts`](https://github.com/mrjoelkemp/node-get-driver-scripts)
to handle pulling driver scripts from a RequireJS build config or resolving aliased
paths via a requirejs config.

### Shell usage:

`taxicab --directory=path/to/my/js path/to/a/file`

* See `taxicab --help` for more information.

Prints:

```
/path/to/a.js
/path/to/b.js
```