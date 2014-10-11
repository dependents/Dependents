var Walker    = require('node-source-walk'),
    types     = require('ast-module-types'),
    escodegen = require('escodegen');

/** @param {String} src the source code for a javascript file using any form of the AMD module syntax */
module.exports = function (src) {
  var dependencies = [],
      walker = new Walker();

  if (! src) throw new Error('src not given');

  walker.walk(src, function (node) {
    var deps;

    if (! types.isTopLevelRequire(node) && ! types.isDefine(node)) return;

    deps = getDependencies(node);
    if (deps.length) {
      dependencies = dependencies.concat(deps);
    }
  });

  // Avoid duplicates
  return dependencies.filter(function(dep, idx) {
    return dependencies.indexOf(dep) === idx;
  });
};

/**
 * @returns {String|null} the type of module syntax used if the node
 * adheres to one of the following syntaxes, or null if it's an unsupported form
 *
 * @example
 * define('name', [deps], func)    'named'
 * define([deps], func)            'deps'
 * define(func(require))           'factory'
 * define({})                      'nodeps'
 */
function getDefineType(node) {
  if (types.isNamedForm(node))        return 'named';
  if (types.isDependencyForm(node))   return 'deps';
  if (types.isFactoryForm(node))      return 'factory';
  if (types.isNoDependencyForm(node)) return 'nodeps';

  return null;
}

/** @returns {String[]} A list of file dependencies or an empty list if there are no dependencies */
function getDependencies(node) {
  var type = getDefineType(node),
  dependencies;

  // Note: No need to handle nodeps since there won't be any dependencies
  switch(type) {
    case 'named':
      return getNamedFormDeps(node);
    case 'deps':
      return getDependencyFormDeps(node);
    case 'factory':
      return getFactoryFormDeps(node);
  }

  return [];
}

//////////////////
// Dependency Helpers
//////////////////

function getNamedFormDeps(node) {
  var args = node['arguments'] || [];

  return getElementValues(args[1]).concat(getInnerDependencies(node));
}

function getDependencyFormDeps(node) {
  var args = node['arguments'] || [];

  return getElementValues(args[0]).concat(getInnerDependencies(node));
}

function getFactoryFormDeps(node) {
  return getInnerDependencies(node);
}

/**
 * Looks for dynamic module loading
 * @param  {AST} node
 * @return {String[]} List of dynamically required dependencies
 */
function getInnerDependencies(node) {
  // Use logic from node-detective to find require calls
  var walker = new Walker(),
      dependencies = [],
      requireArgs, deps;

  walker.traverse(node, function (innerNode) {
    if (types.isRequire(innerNode)) {
      requireArgs = innerNode['arguments'];

      if (! requireArgs.length) return;

      // Either require('x') or require(['x'])
      deps = requireArgs[0];

      if (deps.type === 'ArrayExpression') {
        dependencies = dependencies.concat(getElementValues(deps));
      } else {
        dependencies.push(getEvaluatedValue(deps));
      }
    }
  });

  return dependencies;
}

/**
 * @param {Object} nodeArguments
 * @returns {String[]} the literal values from the passed array
 */
function getElementValues(nodeArguments) {
  var elements = nodeArguments.elements || [];

  return elements.map(function (el) {
    return getEvaluatedValue(el);
  });
}

/**
 * @param {AST} node
 * @returns {String} the statement represented by AST node
 */
function getEvaluatedValue(node) {
  if (node.type === 'Literal') return node.value;

  return escodegen.generate(node);
}
