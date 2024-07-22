/**
 * @import {ElementContent, Element} from 'hast'
 */

import {h} from 'hastscript'
import {block} from '../macro/block.js'

/**
 *
 * @param {string} href
 * @param {Array<ElementContent | string | undefined>} children
 * @returns {Element}
 */
export function more(href, children) {
  return block(h('a.card.more', {href}, h('.column', {}, h('p', {}, children))))
}
