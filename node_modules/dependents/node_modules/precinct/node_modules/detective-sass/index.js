/**
 * Extract the @import statements from a given sass file's content
 *
 * @param  {String} fileContent
 * @return {String[]}
 */
module.exports = function(fileContent) {
  if (!fileContent) { throw new Error('content not given'); }
  if (typeof fileContent !== 'string') { throw new Error('content is not a string'); }

  var dependencies = [];
  var importRegex = /\@import\s['"](.*)['"]/g;

  var matches;

  do {
    matches = importRegex.exec(fileContent);

    if (matches) {
      dependencies.push(matches[1]);
    }

  } while (matches);

  return dependencies;
};
