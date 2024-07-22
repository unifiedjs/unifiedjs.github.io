/**
 * @import {Child} from 'hastscript'
 * @import {Element} from 'hast'
 */

import {h} from 'hastscript'
import {block} from '../macro/block.js'

/**
 * @param {string} href
 * @param {Child} children
 * @returns {Element}
 */
export function more(href, children) {
  return block(h('a.box.more', {href}, h('.column', {}, h('p', {}, children))))
}
