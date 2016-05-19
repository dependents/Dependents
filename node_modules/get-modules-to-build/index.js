var fs = require('fs');

/**
 * Returns the names of the modules listed in the modules section of a requirejs config
 * @param  {String} filename - The requirejs config
 * @return {String[]}
 */
module.exports = function(filename) {
  if (!filename) throw new Error('no file given');

  var contents = fs.readFileSync(filename).toString();

  if (! contents) {
    throw new Error('empty file given');
  }

  try {
    var json = JSON.parse(contents);
    var modules = json.modules || [];

    return modules.map(function(module) {
      return  module.name;
    });

  } catch (e) {
    return [];
  }
};
