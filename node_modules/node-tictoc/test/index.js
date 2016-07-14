var time = require('../');

////
console.log('For loop test');
time.tic();

for (var i = 0; i < 100000; i++) {
}

time.toc();

/////
console.log('\nDelayed test');

time.tic();
setTimeout(function () {
  console.log('Tocking for delayed');
  time.toc();
}, 500);

/////

console.log('\nRecursive test');
(function foo(n) {
  if (! n) return;
  console.log('ticking for n = ', n);
  time.tic();

  foo(n - 1);

  console.log('tocking for n = ', n);
  time.toc(); // prints the elapsed time in last-in-first-out (LIFO) order
})(3);