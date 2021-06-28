import {h} from 'hastscript'
import {visit, SKIP} from 'unist-util-visit'
import {block} from '../macro/block.js'

export function item(href, main, footer) {
  var box = h('a.box', {href}, JSON.parse(JSON.stringify(main)))

  visit(box, 'element', cleanNestedLinks)

  return block(box, footer ? h('ol.row', footer) : undefined)

  function cleanNestedLinks(node, index, parent) {
    if (parent && node.tagName === 'a') {
      parent.children.splice(index, 1, ...node.children)
      return [SKIP, index]
    }
  }
}
