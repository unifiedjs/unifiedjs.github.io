/**
 * @import {ElementContent, Element} from 'hast'
 */

import {h} from 'hastscript'
import {block} from '../macro/block.js'

/**
 * @param {string} href
 * @param {Array<ElementContent> | ElementContent} main
 * @param {Array<ElementContent> | ElementContent | undefined} [footer]
 * @returns {Element}
 */
export function item(href, main, footer) {
  return block(
    h('a.card', {href}, main),
    footer ? h('ol.row', {}, footer) : undefined
  )
}
