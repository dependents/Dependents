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

  debug('found clicked node: ' + clickedNode.type);
  debug('found clicked node: ', clickedNode);

  if (clickedNode.type === 'StringLiteral') {
    // Note: not asserting that the string is part of an import
    // to avoid identifying CJS and AMD imports
    debug('clicked string is part of an import');
    options.partial = clickedNode.value;
    var resolvedPartial = cabinet(options);

    debug('cabinet resolved partial: ' + resolvedPartial);
    // We don't need to specify a location to jump to
    return resolvedPartial;
  }

  debug('searching for a declaration within the current file');
  var declaration = findDeclarationWithinCurrentFile(clickedNode, ast);

  if (!declaration) {
    debug('could not find a declaration for the clicked node within the current file');
    declaration = findDeclarationWithinImport(clickedNode);
  }

  if (!declaration) {
    debug('could not find a declaration for the clicked node in an import');
    return '';
  }

  debug('found a declaration node: ', declaration);

  var identifier = findIdentifierWithinDeclaration(clickedNode, declaration);

  if (!identifier) {
    debug('clicked node identifier could not be found within the declaration');
    return '';
  }

  debug('found the identifier within the declaration');

  var location = identifier.loc.start;
  // +1 because editors start with 1 based column indexing
  var jumpTo = filename + ':' + location.line + ':' + (location.column + 1);

  debug('jumpTo result: ' + jumpTo);
  return jumpTo;
};

function findDeclarationWithinCurrentFile(clickedNode) {
  var parent = clickedNode.parent;

  if (clickedNode.type === 'Identifier') {
    if (parent && parent.type === 'MemberExpression') {
      debug('clicked node is part of a member expression');
      // TODO: Handle foo.bar.baz
      var isObject = parent.object && parent.object.name === clickedNode.name;
      if (isObject) {
        debug('clicked on the object in the expression');
        return findDeclaration(clickedNode);
      }

      debug('clicked on the property, not the object');

      // Find object's declaration then find the member declaration within the object
      // TODO: If parent object is foo.bar, then recurse up to find foo then .bar
      return findDeclaration(parent.object);

    }

    debug('searching for a variable/function declaration');
    return findDeclaration(clickedNode);
  }

  return null;
}

function findDeclaration(clickedNode) {
  var declaratorChecks = {
    VariableDeclaration: function(node, identifier) {
      for (var i = 0, l = node.declarations.length; i < l; i++) {
        var declaration = node.declarations[i];
        if (declaration.type === 'VariableDeclarator' && declaration.id.name === identifier.name) {
          return true;
        }
      }

      return false;
    },
    FunctionDeclaration: function(node, identifier) {
      return node.id && node.id.name === identifier.name;
    }
  };

  var walker = new Walker();
  var declaration;

  walker.moonwalk(clickedNode, function(node) {
    var checker = declaratorChecks[node.type];
    if (checker && checker(node, clickedNode)) {
      declaration = node;
      walker.stopWalking();
    }
  });

  return declaration;
}

function findDeclarationWithinImport(clickedNode, ast) {
  // TODO: Find import associated with clicked node
  // Resolve import partial with cabinet
  // Parse that import then find the clickedNode within that file's ast
}

function findIdentifierWithinDeclaration(clickedNode, declaration) {
  if (declaration.type === 'FunctionDeclaration') {
    return declaration.id;
  }

  if (declaration.type === 'VariableDeclaration') {
    for (var i = 0, l = declaration.declarations.length; i < l; i++) {
      var node = declaration.declarations[i];
      debug('searching current declaration node', node);
      if (node.id && node.id.name === clickedNode.name) {
        return node;
      }

      if (node.init && node.init.type === 'ObjectExpression') {
        var property = findIdentifierWithinProperties(clickedNode, node.init.properties);
        if (property) {
          debug('found property matching the clicked node');
          return property;
        }
      }
    }
  }

  return null;
}

function findIdentifierWithinProperties(clickedNode, properties) {
  for (var i = 0, l = properties.length; i < l; i++) {
    var prop = properties[i];

    if (prop.key && prop.key.name === clickedNode.name) {
      return prop.key;
    }
  }
}
