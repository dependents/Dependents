var Walker  = require('node-source-walk');
var types   = require('ast-module-types');
var fs      = require('fs');

/**
 * Determines the type of the module from the supplied source code or AST
 *
 * @param  {String|Object} source - The string content or AST of a file
 * @return {String}
 */
function fromSource(source) {
  if (typeof source === 'undefined') {
    throw new Error('source not supplied');
  }

  var walker = new Walker();
  var type = 'none';
  var hasDefine = false;
  var hasAMDTopLevelRequire = false;
  var hasRequire = false;
  var hasExports = false;
  var hasES6Import = false;
  var hasES6Export = false;

  // Walker accepts as AST to avoid reparsing
  walker.walk(source, function(node) {
    if (types.isDefine(node)) {
      hasDefine = true;
    }

    if (types.isRequire(node)) {
      hasRequire = true;
    }

    if (types.isExports(node)) {
      hasExports = true;
    }

    if (types.isAMDDriverScriptRequire(node)) {
      hasAMDTopLevelRequire = true;
    }

    if (types.isES6Import(node)) {
      hasES6Import = true;
    }

    if (types.isES6Export(node)) {
      hasES6Export = true;
    }

    if (hasES6Import || hasES6Export) {
      type = 'es6';
      walker.stopWalking();
      return;
    }

    if (hasDefine || hasAMDTopLevelRequire) {
      type = 'amd';
      walker.stopWalking();
      return;
    }

    if (hasExports || (hasRequire && !hasDefine)) {
      type = 'commonjs';
      walker.stopWalking();
      return;
    }
  });

  return type;
}

/**
 * Synchronously determine the module type for the contents of the passed filepath
 *
 * @param  {String} file
 * @return {String}
 */
function sync(file) {
  if (!file) {
    throw new Error('filename missing');
  }

  var data = fs.readFileSync(file, 'utf8');
  return fromSource(data.toString());
}

/**
 * Asynchronously determines the module type for the contents of the given filepath
 *
 * @param  {String}   filepath
 * @param  {Function} cb - Executed with (err, type)
 */
module.exports = function(filepath, cb) {
  if (!filepath) {
    throw new Error('filename missing');
  }

  if (!cb) {
    throw new Error('callback missing');
  }

  var opts = {encoding: 'utf8'};

  fs.readFile(filepath, opts, function(err, data) {
    if (err) {
      return cb(err);
    }

    var type;

    try {
      type = fromSource(data);
    } catch (error) {
      return cb(error);
    }

    cb(null, type);
  });
};

module.exports.sync = sync;
module.exports.fromSource = fromSource;
