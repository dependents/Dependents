module.exports = function(input, clickPosition) {
  var stringPattern = /[\'"]{1}([^"\']*)[\'"]{1}/g;
  // Ignores the first word on a line since that's usually a pragma
  var wordPattern = /[\s]{1}([^\s]*)/g;

  var hasString = stringPattern.test(input);

  return getClickedPattern(hasString ? stringPattern : wordPattern, input, clickPosition);
};

function getClickedPattern(pattern, input, clickedPosition) {
  var match;

  while (match = pattern.exec(input)) {
    if (matchContainsPosition(match, clickedPosition)) {
      return match[1];
    }
  }

  return pattern.exec(input)[1];
}

function matchContainsPosition(match, position) {
  var whole = match[0];
  var startIndex = match.index;
  var endIndex = startIndex + whole.length - 1;
  return startIndex <= position && position <= endIndex;
}
