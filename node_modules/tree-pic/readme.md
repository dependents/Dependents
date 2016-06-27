### tree-pic [![npm](http://img.shields.io/npm/v/tree-pic.svg)](https://npmjs.org/package/tree-pic) [![npm](http://img.shields.io/npm/dm/tree-pic.svg)](https://npmjs.org/package/tree-pic)

> Generate a picture of a file's dependency tree

`npm install tree-pic`

*Heavily inspired by [pahen/madge](https://github.com/pahen/madge).*

### Graphviz dependency

In order to generate the output image, you need to have Graphviz installed.

##### Mac OS X

	$ sudo port install graphviz

OR

	$ brew install graphviz

##### Ubuntu

	$ sudo apt-get install graphviz

### Usage

```js
var treePic = require('tree-pic');

treePic({
  filename: 'path/to/file',
  directory: 'path/to/all/files',
  // optional
  imagePath: 'desired/path/for/generated/image.png',
  requireConfig: 'path/to/requirejs/config.js',
  webpackConfig: 'path/to/webpack.config.js'
})
.then(function(pathOfGeneratedImage) {
  // At this point, the image was already created
});
```

* Under the hood, this module uses [dependency-tree](https://github.com/mrjoelkemp/node-dependency-tree) to generate the tree structure, so we can take pictures of any module types (JS, Sass, Stylus) supported by that module.

### License

MIT
