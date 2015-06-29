### stylus-lookup [![npm](http://img.shields.io/npm/v/stylus-lookup.svg)](https://npmjs.org/package/stylus-lookup) [![npm](http://img.shields.io/npm/dm/stylus-lookup.svg)](https://npmjs.org/package/stylus-lookup)

> Get the file associated with a Stylus import

This module replaces the Stylus compiler's lookup algorithm for resolving a partial's path.

* Handles same directory lookups,
partials with or without extensions, partials within subdirectories,
partials with the `.styl` or `.css` in the name,
partials using the `index.styl` resolution.

* **Does not** currently support glob imports or the use of additional paths. PRs welcome.

*Originally built for [Dependents](https://github.com/mrjoelkemp/Dependents#dependents)*

### Usage

`stylusLookup(dependencyName, filename, directory)`

* `dependencyName`: The partial's name
  * If your stylus file had `@import foo`, then `foo` would be the dependency name
* `filename`: The file importing the dependency
* `directory`: The location of all stylus files

Example:

```js
var stylusLookup = require('stylus-lookup');

stylusLookup('variables', 'app/styles/styles.styl', 'app/styles'); // yields app/styles/variables.styl
```

* This assumes that the file `app/styles/styles.styl` has `@import variables` or `@require variables`
and that all of the other stylus files are located within `app/styles`.