var Walker = require('node-source-walk');
var types = require('ast-module-types');
var fs = require('fs');
var esprima = require('esprima');

/**
 * Identifies the AMD module type
 *
 * @param {Object|String} node - An AST node or a filename
 *
 * @example
 * define('name', [deps], func)    'named'
 * define([deps], func)            'deps'
 * define(func(require))           'factory'
 * define({})                      'nodeps'
 *
 * @returns {String|null} the type of module syntax used, or null if it's an unsupported form
 */
module.exports = function getModuleType(node) {
  var walker = new Walker();
  var type;

  if (typeof node === 'string') {

    walker.walk(fs.readFileSync(node, 'utf8'), function(node) {
      if (type = getModuleType(node)) {
        walker.stopWalking();
      }
    });

    return type;
  }

  if (types.isNamedForm(node))        return 'named';
  if (types.isDependencyForm(node))   return 'deps';
  if (types.isREMForm(node))          return 'rem';
  if (types.isFactoryForm(node))      return 'factory';
  if (types.isNoDependencyForm(node)) return 'nodeps';
  if (types.isAMDDriverScriptRequire(node)) return 'driver';

  return null;
}
