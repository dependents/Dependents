### app-root [![npm](http://img.shields.io/npm/v/app-root.svg)](https://npmjs.org/package/app-root) [![npm](http://img.shields.io/npm/dm/app-root.svg)](https://npmjs.org/package/app-root)

Returns a list of application entry points for front-end applications (JS and Sass).

`npm install app-root`

*An entry point (i.e., root) is a file that no other file requires/imports.*

Works with AMD, CommonJS, ES6, and SASS apps.

This library is particularly useful for automatically deducing the entry point for r.js or browserify configurations as done in [YA](github.com/mrjoelkemp/ya).

A directory may have many roots. This is true if you have multiple apps within a single
directory or if your app uses a multi-bundle architecture (where each page on your
site has its own JS app).

### Usage

```js
var getAppRoot = require('app-root');

// Find the application roots within the js folder
getAppRoot({
  directory: './js',
  success: function (roots) {
    ...
  }
});
```

With configurable options:

```js
getAppRoot({
  directory: './js',
  success: function (roots) {
    ...
  },

  ignoreDirectories: [/.+_components/, 'vendor', 'node_modules', '.git'],
  ignoreFiles: ['Gruntfile.js'],
  includeNoDependencyModules: true,
  config: 'path/to/my/requirejs/config.js'
});
```

### Options

* `ignoreDirectories`: list of directory names (strings or regex) to ignore
* `ignoreFiles`: list of file names (strings or regex) to ignore
* `includeNoDependencyModules`: (default false) Whether or not to include, as potential roots, modules that have no dependencies
* `config`: path to your module loader configuration (for resolving aliased module paths)

Or via a shell command

`approot directory`

* Where `directory` is the directory containing roots you'd like to identify