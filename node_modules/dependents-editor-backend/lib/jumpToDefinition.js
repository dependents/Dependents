var debug = require('./debug');
var Walker = require('node-source-walk');
var fs = require('fs');

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

  var walker = new Walker();
  var ast;

  try {
    ast = walker.parse(fs.readFileSync(filename, 'utf8'));
  } catch (e) {
    debug('could not read ' + filename);
    throw new Error('Could not read the file: ' + filename);
  }

  debug('finding the clicked node path');

  var clickedNode = findClickedNode(walker, ast, clickPosition);

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
  }
};

function findClickedNode(walker, ast, clickPosition) {
  var clickedNode;

  walker.walk(ast, function(node) {
    var location = node.loc;

    if (!location || typeof node.type === 'object') { return; }

    // Provides sane output devoid of parents and constructors
    location = {
      start: {
        line: location.start.line,
        column: location.start.column,
      },
      end: {
        line: location.end.line,
        column: location.end.column
      }
    };

    debug('current node: ', node.type);

    if (clickedWithinNodeLocation(clickPosition, location)) {
      debug('click position is within this node: ' + node.type);
      // The last node within the location should be the inner-most and represent the exact match
      clickedNode = node;

    } else if (nodeLocationBeyondClickPosition(clickPosition, location)) {
      debug('current node is beyond the clicked node, so stopping the walk');
      walker.stopWalking();
    }
  });

  return clickedNode;
}

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

function clickedWithinNodeLocation(clickPosition, location) {
  var clickLine = clickPosition.line;
  var clickColumn = clickPosition.column;

  debug('clickWithinNodeLocation clickPosition: ', clickPosition);
  debug('clickWithinNodeLocation location: ', location);

  var linesIntersect = (location.start.line <= clickLine) && (clickLine <= location.end.line);
  var columnsIntersect = (location.start.column <= clickColumn) && (clickColumn <= location.end.column);

  debug('lines intersect? ', linesIntersect);
  debug('columnsIntersect intersect? ', columnsIntersect);

  return linesIntersect && columnsIntersect;
}

function nodeLocationBeyondClickPosition(clickPosition, location) {
  var clickLine = clickPosition.line;
  var clickColumn = clickPosition.column;

  debug('nodeLocationBeyondClickPosition clickPosition: ', clickPosition);
  debug('nodeLocationBeyondClickPosition location: ', location);

  var isNodeLineBeyond = location.start.line > clickLine;

  debug('isNodeLineBeyond? ', isNodeLineBeyond);

  return isNodeLineBeyond;
}
