/**
 * @import {ElementContent, Element, Root} from 'hast'
 * @import {BuildVisitor} from 'unist-util-visit'
 */

import {h} from 'hastscript'
import {visit, SKIP} from 'unist-util-visit'
import {block} from '../macro/block.js'

/**
 * @param {string} href
 * @param {Array<ElementContent> | ElementContent | undefined} [main]
 * @param {Array<ElementContent> | ElementContent | undefined} [footer]
 * @returns {Element}
 */
export function item(href, main, footer) {
  const box = h('a.box', {href}, structuredClone(main))

  visit(box, 'element', cleanNestedLinks)

  return block(box, footer ? h('ol.row', {}, footer) : undefined)

  /** @type {BuildVisitor<Root, 'element'>} */
  function cleanNestedLinks(node, index, parent) {
    if (parent && typeof index === 'number' && node.tagName === 'a') {
      parent.children.splice(index, 1, ...node.children)
      return [SKIP, index]
    }
  }
}
