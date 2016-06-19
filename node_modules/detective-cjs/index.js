var Walker = require('node-source-walk');
var types = require('ast-module-types');

/**
 * @param  {String|Object} content - A file's string content or its AST
 * @return {String[]} The file's dependencies
 */
module.exports = function(content) {
  var walker = new Walker();

  var dependencies = [];

  walker.walk(content, function(node) {
    var dependency;

    if (!types.isRequire(node) ||
        !node.arguments ||
        !node.arguments.length) {
      return;
    }

    if (node.arguments[0].type === 'Literal' || node.arguments[0].type === 'StringLiteral') {
      dependency = node.arguments[0].value;
      dependencies.push(dependency);
    }
  });

  return dependencies;
};
