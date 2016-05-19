require([
  './a'
], function(a) {
  'use strict';

  // Dynamic require
  require(['./b'], function(b) {

  });
});
