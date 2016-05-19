var acorn = require('acorn');
var acornLoose = require('acorn/dist/acorn_loose');
var debug = require('debug')('parse');

/**
 * Parse with strict mode then with loose mode as a fallback
 *
 * @param  {String}  content
 * @return {Object}  ast
 */
module.exports = function(content) {
  var ast;
  var parserOptions = module.exports._getParserOptions();
  debug('parser options: ' + JSON.stringify(parserOptions));

  // Returns an object if ok, if not, returns an empty array
  try {
    debug('trying the regular parser');
    ast = acorn.parse(content, parserOptions);

  } catch (err) {
    debug('using the loose parser');
    ast = acornLoose.parse_dammit(content, parserOptions);
  }

  debug('parsed ast: ', ast);
  return ast;
};

/**
 * Exposed for testing
 * @return {Object}
 */
module.exports._getParserOptions = function() {
  return {
    ecmaVersion: 6
  };
};
