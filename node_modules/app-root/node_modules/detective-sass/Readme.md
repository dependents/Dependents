### detective-sass [![npm](http://img.shields.io/npm/v/detective-sass.svg)](https://npmjs.org/package/detective-sass) [![npm](http://img.shields.io/npm/dm/detective-sass.svg)](https://npmjs.org/package/detective-sass)

> Find the dependencies of a sass/scss file

`npm install --save detective-sass`

It's the SASS counterpart to [detective](https://github.com/substack/node-detective), [detective-amd](https://github.com/mrjoelkemp/node-detective-amd), and [detective-es6](https://github.com/mrjoelkemp/node-detective-es6).

* The AST is generated using the [gonzales-pe](https://github.com/tonyganch/gonzales-pe) parser.

### Usage

```js
var detective = require('detective-sass');

var content = fs.readFileSync('styles.scss', 'utf8');

// list of imported file names (ex: '_foo.scss', '_foo', etc)
var dependencies = detective(content);
```

You can also supply an *optional* set of configuration options as the second argument to `detective`:

```
var dependencies = detective(content, {
  syntax: 'sass'
});
```

Options you can specify:

* `syntax`: The syntax of the file. Instructs the parser which language to expect.
 - Possible values: `sass` (default) or `scss`
 - See the [parser's documentation](https://github.com/tonyganch/gonzales-pe#parameters-1) for more details.

### Related

Check out [node-sass-lookup](https://github.com/dependents/node-sass-lookup) if you want to map a sass/scss dependency to a file on your filesystem.

### License

MIT
