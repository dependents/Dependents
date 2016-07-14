### tictoc

`npm install node-tictoc`

Wrapper around `process.hrtime` that lets you have a stack of timers with a simpler api and more useful output:

### Usage

```javascript
  var time = require('node-tictoc');

  time.tic();

  for(var i = 0; i < 1000; i++) {
    // do something
  }

  time.toc(); // prints the elapsed seconds and/or milliseconds
```

Or a recursive timing solution that takes advantage of the stack:

```javascript
  function foo(n) {
    if (! n) return;

    time.tic();

    foo(n - 1);

    time.toc(); // prints the elapsed time in last-in-first-out (LIFO) order
  }
```

If you just want the time values:

```javascript
  time.toct()
```

If you want the profiling string but don't want it console logged automatically:

```
  time.stoc();
```

Returns an object with the following values for the most recent timer (started with `tic`):

* `seconds`
* `nanos`
* `ms`
