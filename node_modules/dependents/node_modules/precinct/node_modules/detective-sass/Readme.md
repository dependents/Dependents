### detective-sass

> Find the dependencies of a sass file

`npm install detective-sass`

It's the SASS counterpart to [detective](https://github.com/substack/node-detective), [detective-amd](https://github.com/mrjoelkemp/node-detective-amd), and [detective-es6](https://github.com/mrjoelkemp/node-detective-es6).

Note: this detective uses a regex to find the `@import` statements as there is no good solution for retrieving the AST of a SASS file.

### Usage

```js
var detective = require('detective-sass');

var content = fs.readFileSync('styles.scss', 'utf8');

// list of imported file names (ex: '_foo.scss', '_foo', etc)
var dependencies = detective(content);
```

