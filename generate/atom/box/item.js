'use strict'

var h = require('hastscript')
var visit = require('unist-util-visit')
var block = require('../macro/block.js')

module.exports = item

function item(href, main, footer) {
  var box = h('a.box', {href}, JSON.parse(JSON.stringify(main)))

  visit(box, 'element', cleanNestedLinks)

  return block(box, footer ? h('ol.row', footer) : undefined)

  function cleanNestedLinks(node, index, parent) {
    if (parent && node.tagName === 'a') {
      parent.children.splice(index, 1, ...node.children)
      return [visit.SKIP, index]
    }
  }
}
