#### get-driver-scripts

Gets the entry point filepaths to an application from a build configuration
or by finding them about a directory.

`npm install get-driver-scripts`

### Usage

```js
var getDrivers = require('get-driver-scripts');

getDrivers({
  directory: 'path/to/my/js',
  success: function(err, drivers) {

  }
})
```

##### Optional properties:

* `exclusions`: a list of (sub)directory names to exclude from the search
* `buildConfig`: a RequireJS build configuration that [contains a list of `modules`](http://requirejs.org/docs/optimization.html#wholeproject)
 * This config will be parsed and you'll get back the filepaths of those modules
* `config`: a RequireJS configuration that lists aliased paths.
 * This is necessary when you don't supply a build config and want the plugin to find all of the driver scripts.
 * Aliased paths need to be resolved to real filepaths during the search