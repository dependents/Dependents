# Dependents [![npm](http://img.shields.io/npm/v/dependents.svg)](https://npmjs.org/package/dependents) [![npm](http://img.shields.io/npm/dm/dependents.svg)](https://npmjs.org/package/dependents)

> Get the modules that depend on (i.e., require/import) a given module.

`npm install dependents`

*Primarily built for use in [Sublime Dependents](https://github.com/mrjoelkemp/sublime-dependents).*

* Supports JS module systems: AMD, CommonJS, and ES6 modules.
* Supports SASS imports.

### Usage

JS Example:

```javascript
var dependents = require('dependents');

// Find all modules that require (depend on) ./a.js
dependents.for({
  filename: './a.js',
  directory: './',
  config: 'path/to/my/config.js' // optional
  success: function (dependents) {
    console.log(dependents);
  }
});
```

SASS Example:

```javascript
var dependents = require('dependents');

// Find all sass files that import (depend on) _myPartial.scss
dependents.for({
  filename: '_myPartial.scss',
  directory: 'path/to/my/sass',
  success: function (dependents) {
    console.log(dependents);
  }
});
```

Required options:

* `filename`: the module that you want to get the dependents of
* `directory`: the directory to search for dependents (also known as the "root")
* `success`: a function that should accept a list of filenames representing modules that depend on the module in `filename`

Optional:

* `files`: list of files to search through (if you want to control the files processed). Useful in clustering.
* `config`: path to your requirejs config. Used to look up path aliases.


Or via a shell command:

Requires `npm install -g dependents`

```bash
dependents filename directory [config]
```
