var Walker = require('node-source-walk');
var debug = require('./debug');

module.exports = function getClickedNode(ast, clickPosition) {
  var clickedNode;

  var walker = new Walker();

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
};

function clickedWithinNodeLocation(clickPosition, location) {
  var clickLine = clickPosition.line;
  var clickColumn = clickPosition.column;

  var linesIntersect = (location.start.line <= clickLine) && (clickLine <= location.end.line);
  var columnsIntersect = (location.start.column <= clickColumn) && (clickColumn <= location.end.column);

  return linesIntersect && columnsIntersect;
}

function nodeLocationBeyondClickPosition(clickPosition, location) {
  var clickLine = clickPosition.line;
  var clickColumn = clickPosition.column;

  var isNodeLineBeyond = location.start.line > clickLine;

  return isNodeLineBeyond;
}
