var Mixpanel = require('mixpanel');
var key = '668c67952eeebdfd690a6df83df70dda';

if (process.env.DEPENDENTS_DEV) {
  key = '223b85e5b8197f9dd127d9f9c0265801';
}

var mixpanel = Mixpanel.init(key);

module.exports = mixpanel;
