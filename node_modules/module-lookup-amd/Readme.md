### module-lookup-amd

Gives you the real path of (possibly) aliased modules. Otherwise, gives you back the same dependency name if it's not aliased.

`npm install module-lookup-amd`

### Usage

```js

var lookup = require('module-lookup-amd');

var realPath = lookup('path/to/my/config.js', 'dependency/path');
```

### `lookup(configPath, dependencyPath)`

* `configPath`: the path to your RequireJS configuration file
* `dependencyPath`: the (potentially aliased) dependency that you want to lookup
