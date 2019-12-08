'use strict'

var visit = require('unist-util-visit')

module.exports = defer

function defer() {
  return transform

  function transform(tree) {
    var scripts = []
    var scope
    var head = null

    visit(tree, 'element', visitor)

    scope = head || tree
    scope.children = scope.children.concat(scripts)

    function visitor(node, index, parent) {
      if (node.tagName === 'script') {
        if (!node.properties.type || !/module/i.test(node.properties.type)) {
          node.properties.defer = true
        }

        scripts.push(node)
        parent.children.splice(index, 1)

        return index
      }

      if (node.tagName === 'head') {
        head = node
      }
    }
  }
}
