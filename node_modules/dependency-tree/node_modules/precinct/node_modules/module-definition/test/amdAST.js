module.exports = {
  type: 'Program',
  body: [{
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
          type: 'Identifier',
          name: 'define'
      },
      arguments: [
        {
          type: 'ArrayExpression',
          elements: []
        },
        {
          type: 'FunctionExpression',
          id: null,
          params: [],
          defaults: [],
          body: {
            type: 'BlockStatement',
            body: []
          },
          rest: null,
          generator: false,
          expression: false
      }]
    }
  }]
};