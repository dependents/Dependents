// Should be the root node unless require by another file
// Score should be 4 + score of each dependency
var b = require('./b'),
    c = require('./c'),
    v1 = require('./views/v1.js'),
    m1 = require('./models/m1.js'),

    // These should not count toward this file's score
    path = require('path'),
    fs = require('fs');

console.log('Sup');