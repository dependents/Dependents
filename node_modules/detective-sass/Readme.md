### detective-sass [![npm](http://img.shields.io/npm/v/detective-sass.svg)](https://npmjs.org/package/detective-sass) [![npm](http://img.shields.io/npm/dm/detective-sass.svg)](https://npmjs.org/package/detective-sass)

> Find the dependencies of a sass/scss file

`npm install detective-sass`

It's the SASS counterpart to [detective](https://github.com/substack/node-detective), [detective-amd](https://github.com/mrjoelkemp/node-detective-amd), and [detective-es6](https://github.com/mrjoelkemp/node-detective-es6).

* The AST is generated using the [gonzales-pe](https://github.com/tonyganch/gonzales-pe) parser.

### Usage

```js
var detective = require('detective-sass');

var content = fs.readFileSync('styles.scss', 'utf8');

// list of imported file names (ex: '_foo.scss', '_foo', etc)
var dependencies = detective(content);
```

### License

MIT
