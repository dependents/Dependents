### get-modules-to-build

> Get the names of the modules to build from a requirejs config

`npm install -g get-modules-to-build`

### Usage

```js
var getModuleNames = require('get-modules-to-build');

var modulesNames = getModuleNames('path/to/my/requirejs/config/build.json');
```

Or via the shell:

```
get-modules-to-build my/build/config.json
```
