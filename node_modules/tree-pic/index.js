var depTree = require('dependency-tree');
var graphviz = require('graphviz');
var debug = require('debug')('tree-pic');
var path = require('path');
var fs = require('fs');
var q = require('q');
var exec = require('child_process').exec;

/**
 * @param  {Object} options
 * @param  {String} options.filename
 * @param  {String} options.directory
 * @param  {String} [options.requireConfig]
 * @param  {String} [options.webpackConfig]
 * @param  {String} [options.imagePath] - The desired filepath of the generated image
 * @param  {String} [options.layout] - The graphvis layout to use for the image
 * @return {Promise} resolves with the path to the generated image
 */
module.exports = function(options) {
  var deferred = q.defer();

  return q.fcall(function() {
    if (!options.filename) {
      throw new Error('filename not provided');
    }

    if (!options.directory) {
      throw new Error('directory not provided');
    }

    options.imagePath = options.imagePath || generateImagePath({
      filename: options.filename,
      directory: options.directory
    });
  })
  .then(isGraphvizInstalled)
  .then(function() {
    debug('generating the dependency tree with the following options: \n', options);
    return generateTree(options);
  })
  .then(function(tree) {
    return q.fcall(function() {
      debug('generating graphviz graph of the tree');
      return generateGraph(tree, options.directory);
    });
  })
  .then(function(graph) {
    debug('generating output image of the graph');

    return outputGraph({
      graph: graph,
      imagePath: options.imagePath,
      layout: options.layout
    });
  });
};

function generateTree(options) {
  var generatingTree = q.fcall(function() {
    return depTree({
      root: options.directory,
      filename: options.filename,
      config: options.requireConfig,
      webpackConfig: options.webpackConfig
    });
  });

  generatingTree.catch(function(e) {
    debug('tree generation error: ' + e.message);
    debug(e.stack);
  });

  return generatingTree;
}

function isGraphvizInstalled() {
  debug('checking if the graphviz binary is installed');

  return checkGraphvizBinary().then(null, function(error) {
    debug('graphviz not installed');
    debug('graphviz error: ' + error.message);
    debug(error.stack);

    throw new Error('Graphviz could not be found. Ensure that "gvpr" is in your $PATH.');
  });
}

function checkGraphvizBinary() {
  return q.nfcall(exec, 'gvpr -V');
}

function generateGraph(tree, directory) {
  var root = Object.keys(tree)[0];
  var graph = graphviz.digraph('G');

  directory = directory[directory.length - 1] === '/' ? directory : directory + '/';

  var rootNode = graph.addNode(root.replace(directory, ''));

  graphHelper(graph, rootNode, tree[root], directory);

  return graph;
}

// Depth-first search to generate the graph
function graphHelper(graph, parentNode, childrenMap, directory) {
  debug('parentId: ' + parentNode.id);

  Object.keys(childrenMap).forEach(function(childPath) {
    var childNode = graph.from(childPath.replace(directory, ''));
    debug('childId: ' + childNode.id);

    graph.addEdge(parentNode, childNode);
    debug('added edge: ' + parentNode.id + ' -> ' + childNode.id);

    graphHelper(graph, childNode, childrenMap[childPath], directory);
  });
}

function generateImagePath(options) {
  return path.join(options.directory, 'Tree_for_' + path.basename(options.filename, path.extname(options.filename)) + '.png');
}

function outputGraph(options) {
  var deferred = q.defer();

  options.graph.output(createGraphvizOptions(options), function(imageBuffer) {
    fs.writeFile(options.imagePath, imageBuffer, function(err) {
      if (err) {
        debug('image file write error: ' + err.message);
        deferred.reject(err);
      } else {
        debug('image created at: ' + options.imagePath);
        deferred.resolve(options.imagePath);
      }
    });
  });

  return deferred.promise;
}

// Modified from pahen/madge
function createGraphvizOptions(opts) {
  // Valid attributes: http://www.graphviz.org/doc/info/attrs.html
  var G = {
    layout: opts.layout || 'dot',
    overlap: false,
    bgcolor: '#ffffff'
  };

  var N = {
    fontname: 'Times-Roman',
    fontsize: 14
  };

  var E = {};

  G.bgcolor = '#000000';
  E.color = '#757575';
  N.color = '#c6c5fe';
  N.fontcolor = '#c6c5fe';

  return {
    type: 'png',
    G: G,
    E: E,
    N: N
  };
}
