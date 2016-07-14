/**
 * Stack of timers
 * @type {Array}
 */
var timers = [];

module.exports.log = console.log.bind(console);

/**
 * Creates a new timer
 */
module.exports.tic = function () {
  timers.push(process.hrtime());
};

/**
 * Prints the elapsed seconds and milliseconds for the most recent timer
 */
module.exports.toc = function () {
  var result = this.stoc();

  this.log(result);
};

// Useful for folks who want to print via another logger like `debug`
module.exports.stoc = function() {
  var time = this.toct();

  var result = '';

  if (time.seconds) result += time.seconds + ' seconds ';
  if (time.ms)      result += time.ms + ' ms ';

  return result;
};

/**
 * If you just want the elapsed time without printing
 * @return {Object} Contains the time conversions (seconds, nanos, ms) for the most recent timer
 */
module.exports.toct = function() {
  if (! timers.length) return null;

  var time = process.hrtime(timers.pop());

  return {
    seconds: time[0],
    nanos:   time[1],
    ms:      time[1] / 1000000
  };
};
