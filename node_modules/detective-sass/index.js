var Walker = require('node-source-walk');
var sass = require('sass-thematic');

/**
 * Extract the @import statements from a given sass file's content
 *
 * @param  {String} fileContent
 * @return {String[]}
 */
module.exports = function(fileContent) {
  if (typeof fileContent === 'undefined') { throw new Error('content not given'); }
  if (typeof fileContent !== 'string') { throw new Error('content is not a string'); }

  var dependencies = [];

  var walker = new Walker();

  var ast = sass.parseASTSync({
    data: fileContent
  });

  walker.walk(ast, function(node) {
    if (!isImportStatement(node)) { return; }

    dependencies = dependencies.concat(extractDependencies(node));
  });

  return dependencies;
};

function isImportStatement(node) {
  if (!node || node.type !== 'atrules') { return false; }
  if (!node.content.length || node.content[0].type !== 'atkeyword') { return false; }

  var atKeyword = node.content[0];

  if (!atKeyword.content.length) { return false; }

  var importKeyword = atKeyword.content[0];

  if (importKeyword.type !== 'ident' || importKeyword.content !== 'import') { return false; }

  return true;
}

function extractDependencies(importStatementNode) {
  return importStatementNode.content
  .filter(function(innerNode) {
    return innerNode.type === 'string' || innerNode.type === 'ident';
  })
  .map(function(identifierNode) {
    return identifierNode.content.replace(/["']/g, '');
  });
}
