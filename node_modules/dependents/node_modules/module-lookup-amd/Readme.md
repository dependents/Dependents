### module-lookup-amd [![npm](http://img.shields.io/npm/v/module-lookup-amd.svg)](https://npmjs.org/package/module-lookup-amd) [![npm](http://img.shields.io/npm/dm/module-lookup-amd.svg)](https://npmjs.org/package/module-lookup-amd)

This module basically exposes the requirejs config map and path resolution logic
and gives you back the real, absolute, path of (possibly) aliased modules names.

I built this for [Dependents'](https://sublime.wbond.net/packages/Dependents) [jump to dependency](https://github.com/mrjoelkemp/Dependents#jump-to-a-dependency) feature that lets you click on a module name
and open the file that name resolves to.

`npm install module-lookup-amd`

### Usage

```js

var lookup = require('module-lookup-amd');

var realPath = lookup('path/to/my/config.js', 'dependency/path', 'path/to/file/containing/dependency');
```

### `lookup(configPath, dependencyPath, filepath)`

* `configPath`: the path to your RequireJS configuration file
* `dependencyPath`: the (potentially aliased) dependency that you want to lookup
* `filepath`: the filepath of the file that contains the dependency (i.e., parent module)

### Shell usage

*Assumes a global `-g` installation*

`lookup-amd -c path/to/my/config.js -f path/to/file/containing/dependency my/dependency/name`
