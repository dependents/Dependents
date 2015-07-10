var dependents = require('dependents');
var isCallingFunction = require('is-calling-function');
var fs = require('fs');

module.exports = function(options) {
  getDependents(options, function(err, dependents) {
    var callers = dependents.filter(function(dependent) {
      var content = fs.readFileSync(dependent, 'utf8');
      return isCallingFunction(content, options.functionName);
    });

    if (err) {
      options.success(err);
      return;
    }

    options.success(null, callers);
  });
};

function getDependents(options, cb) {
  dependents({
    filename: options.filename,
    directory: options.directory,
    config: options.config,
    exclude: options.exclude
  }, cb);
}
