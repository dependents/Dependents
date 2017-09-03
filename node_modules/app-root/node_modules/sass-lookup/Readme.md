### sass-lookup [![npm](http://img.shields.io/npm/v/sass-lookup.svg)](https://npmjs.org/package/sass-lookup) [![npm](http://img.shields.io/npm/dm/sass-lookup.svg)](https://npmjs.org/package/sass-lookup)

> Get the file associated with a Sass import

This module replaces the Sass compiler's lookup algorithm for resolving a partial's path.

* Handles underscored/non-underscored partials,
partials with filenames, partials within subdirectories,
partials with the `.scss` in the name, all of it.

*Originally built for [Dependents](https://github.com/mrjoelkemp/Dependents#dependents)*

### Usage

`sassLookup(dependencyName, filename, directory)`

* `dependencyName`: The partial's name
  * If your sass file had `@import "foo";`, then `"foo"` would be the dependency name
* `filename`: The file importing the dependency
* `directory`: The location of all sass files

Example:

```js
var sassLookup = require('sass-lookup');

sassLookup('variables', 'app/styles/styles.scss', 'app/styles'); // yields app/styles/variables.scss
```

* This assumes that the file `app/styles/styles.scss' has `@import "variables";`
and that all of the other sass files are located within `app/styles`.
* Would yield `app/styles/_variables.scss` if the partial had an underscored filename.