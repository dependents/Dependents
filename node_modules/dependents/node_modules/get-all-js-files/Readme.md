### get-all-js-files

This only exists because I used this functionality in numerous projects. It's a simple wrapper of node-dir
to get js files from a directory and run callbacks on each file and on traversal completion.

`npm install get-all-js-files`

### Usage

```js
var getAllJSFiles = require('get-all-js-files');

getAllJSFiles({
  directory: 'some/path',
  filesCb: function() {},
  contentCb: function() {}
})
```

#### `getAllJSFiles(options)`

Options:

* `directory`: the directory where JS files should be found
* `filesCb`: callback to be executed with the list of found files
* `contentCb`: callback to be executed for each file. Should expect `filename, fileContent` as arguments
