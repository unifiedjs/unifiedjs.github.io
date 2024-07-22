/**
 * @import {Element, Root} from 'hast'
 * @import {BuildVisitor} from 'unist-util-visit'
 */

import assert from 'node:assert/strict'
import {visit} from 'unist-util-visit'

export default function rehypeDefer() {
  return transform

  /**
   * @param {Root} tree
   * @returns {undefined}
   */
  function transform(tree) {
    /** @type {Array<Element>} */
    const scripts = []
    /** @type {Element | null} */
    let head = null

    visit(tree, 'element', visitor)

    const scope = head || tree
    scope.children = scope.children.concat(scripts)

    /** @type {BuildVisitor<Root, 'element'>} */
    function visitor(node, index, parent) {
      if (node.tagName === 'script') {
        assert(parent)
        assert(typeof index === 'number')
        if (
          !node.properties.type ||
          !/module/i.test(String(node.properties.type))
        ) {
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
