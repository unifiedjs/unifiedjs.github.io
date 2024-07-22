/**
 * @import {Element, Root} from 'hast'
 */

import {header} from '../molecule/header.js'
import {footer} from '../molecule/footer.js'

export default function rehypeWrap() {
  return transform

  /**
   * @param {Root} tree
   * @returns {undefined}
   */
  function transform(tree) {
    tree.children.unshift(...header())
    tree.children.push(footer())
  }
}
