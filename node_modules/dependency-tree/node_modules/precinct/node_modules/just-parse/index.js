var acorn = require('acorn/acorn');
var acornLoose = require('acorn/acorn_loose');

/**
 * Parse with strict mode then with loose mode as a fallback
 *
 * @param  {String}  content
 * @return {Object}  ast
 */
module.exports = function(content) {
  var ast;
  var parserOptions = {
    ecmaVersion: 6
  };

  // Returns an object if ok, if not, returns an empty array
  try {
    ast = acorn.parse(content, parserOptions);

  } catch (err) {
    ast = acornLoose.parse_dammit(content, parserOptions);
  }

  return ast;
};
