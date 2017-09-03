var Walker = require('node-source-walk');

/**
 * Extracts the dependencies of the supplied es6 module
 *
 * @param  {String|Object} src - File's content or AST
 * @return {String[]}
 */
module.exports = function(src) {
  var walker = new Walker();

  var dependencies = [];

  if (typeof src === 'undefined') { throw new Error('src not given'); }

  if (src === '') {
    return dependencies;
  }

  walker.walk(src, function(node) {
    switch (node.type) {
      case 'ImportDeclaration':
        if (node.source && node.source.value) {
          dependencies.push(node.source.value);
        }
        break;
      case 'ExportNamedDeclaration':
      case 'ExportAllDeclaration':
        if (node.source && node.source.value) {
          dependencies.push(node.source.value);
        }
        break;
      case 'CallExpression':
        if (node.callee.type === 'Import' && node.arguments.length) {
          dependencies.push(node.arguments[0].value);
        }
      default:
        return;
    }
  });

  return dependencies;
};
