/**
 * @import {Element, Parents} from 'hast'
 */

import {h} from 'hastscript'

/**
 * @param {string} value
 * @param {Parents | undefined} [rich]
 * @returns {Element}
 */
export function description(value, rich) {
  return h('li.ellipsis.content', {}, rich ? rich.children : value)
}
