var fs = require('fs');
var Walker = require('node-source-walk');
var cabinet = require('filing-cabinet');
var debug = require('./debug');
var getClickedNode = require('./getClickedNode');

module.exports = function(options) {
  options = options || {};

  var filename = options.filename;
  var clickPosition = options.clickPosition.split(',').map(Number);

  if (clickPosition.length < 2) {
    throw new Error('Click position should be of the format row,col');
  }

  clickPosition = {
    line: clickPosition[0],
    column: clickPosition[1]
  };

  debug('parsed clickPosition: ', clickPosition);

  var ast;

  try {
    var walker = new Walker();
    ast = walker.parse(fs.readFileSync(filename, 'utf8'));
    options.ast = ast;
  } catch (e) {
    debug('could not read ' + filename);
    throw new Error('Could not read the file: ' + filename);
  }

  debug('finding the clicked node path');

  var clickedNode = getClickedNode(ast, clickPosition);

  if (!clickedNode) {
    debug('could not find the clicked node');
    return '';
  }

  debug('clickedNode type: ' + clickedNode.type);
  debug('clicked node: ', clickedNode);

  if (clickedNode.type === 'Identifier') {
    var declarationNode = findIdentifierWithinDeclarator(clickedNode);

    if (!declarationNode) {
      debug('declaration could not be found');
      return '';
    }

    debug('declaration node found: ', declarationNode);
    var location = declarationNode.loc.start;
    // +1 because editors start with 1 based column indexing
    var jumpTo = filename + ':' + location.line + ':' + (location.column + 1);

    debug('jumpTo result: ' + jumpTo);
    return jumpTo;

  } else if (clickedNode.type === 'StringLiteral') {
    // Note: not asserting that the string is part of an import
    // to avoid identifying CJS and AMD imports
    debug('clicked string is part of an import');
    options.partial = clickedNode.value;
    var resolvedPartial = cabinet(options);

    debug('cabinet resolved partial: ' + resolvedPartial);
    // We don't need to specify a location to jump to
    return resolvedPartial;
  }

  return '';
};

function findIdentifierWithinDeclarator(identifierNode) {
  var declaratorChecks = {
    VariableDeclaration: function(node) {
      for (var i = 0, l = node.declarations.length; i < l; i++) {
        var declaration = node.declarations[i];
        if (declaration.type === 'VariableDeclarator' && declaration.id.name === identifierNode.name) {
          return declaration;
        }
      }
    },
    ImportDeclaration: function(node) {
      var specifierChecks = {
        ImportSpecifier: function(node) {
          if (node.imported.type === 'Identifier' &&
              node.imported.name === identifierNode.name) {
            return node.imported;
          }
        },
        ImportDefaultSpecifier: function(node) {
          if (node.local.type === 'Identifier' &&
              node.local.name === identifierNode.name) {
            return node.local;
          }
        },
        ImportNamespaceSpecifier: function(node) {
          if (node.local.type === 'Identifier' &&
              node.local.name === identifierNode.name) {
            return node.local;
          }
        }
      };

      var relevantIdentifier;

      for (var i = 0, l = node.specifiers.length; i < l; i++) {
        var specifier = node.specifiers[i];
        var result = specifierChecks[specifier.type](specifier);

        if (result) {
          relevantIdentifier = result;
        }
      }

      return relevantIdentifier;
    }
  };

  var declaredIdentifierNode;
  var walker = new Walker();

  walker.moonwalk(identifierNode, function(node) {
    debug('findIdentifierWithinDeclarator: looking at node type: ' + node.type);
    if (declaratorChecks[node.type]) {
      var declaredIdentifier = declaratorChecks[node.type](node);

      if (declaredIdentifier) {
        debug('found the declared identifier: ', declaredIdentifier);
        declaredIdentifierNode = declaredIdentifier;
        walker.stopWalking();
      }
    }
  });

  return declaredIdentifierNode;
}
