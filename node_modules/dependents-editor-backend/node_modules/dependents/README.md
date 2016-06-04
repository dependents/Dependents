# Dependents [![npm](http://img.shields.io/npm/v/dependents.svg)](https://npmjs.org/package/dependents) [![npm](http://img.shields.io/npm/dm/dependents.svg)](https://npmjs.org/package/dependents)

> Get the modules that depend on (i.e., require/import) a given module.

`npm install dependents`

*Primarily built for use in [Sublime Dependents](https://github.com/mrjoelkemp/sublime-dependents).*

* Supports JS module systems: AMD, CommonJS, and ES6 modules. Also supports RequireJS and Webpack loader configurations.
* Supports SASS imports.
* Support Stylus import/require

Note: this library *will utilize multi-core processing* if the number of files to process
within the supplied directory is >= 500.

* That empirical threshold was found to be when the tool started to naturally slow down.

### Usage

##### JS Example:

```js
var dependents = require('dependents');

// Find all modules that require (depend on) ./a.js
dependents({
  filename: './a.js',
  directory: './',
  config: 'path/to/my/config.js', // optional
  webpackConfig: 'path/to/my/webpack.config.js', // optional
  exclude: ['my_vendor_files'],  // optional
},
function(err, dependents) {
  console.log(dependents);
});
```

##### SASS Example:

* Other CSS preprocessors follow the usage pattern

```javascript
var dependents = require('dependents');

// Find all sass files that import (depend on) _myPartial.scss
dependents({
  filename: '_myPartial.scss',
  directory: 'path/to/my/sass',
},
function(err, dependents) {
  console.log(dependents);
});
```

### Options

##### Required options:

* `filename`: the module that you want to get the dependents of
* `directory`: the directory to search for dependents (also known as the "root")

##### Optional:

* `files`: list of files to search through (if you want to control the files processed). Useful in clustering.
* `config`: path to your requirejs config. Used to look up path aliases.
* `webpackConfig`: path to your webpack config. Used to look up path aliases.
* `exclude`: a list of files and/or folders to exclude from the search.
 * The following 3rd party modules are excluded from the following folders by default: `node_modules`, `bower_components`, `vendor`

### CLI

Requires `npm install -g dependents`

```bash
dependents --directory=path/to/my/js [options] filename
```

* You can see all the cli options via `dependents --help`