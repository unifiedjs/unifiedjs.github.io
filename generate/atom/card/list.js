/**
 * @import {Element} from 'hast'
 * @import {Map, Options} from '../macro/list.js'
 */

import {h} from 'hastscript'
import {list as baseList} from '../macro/list.js'

/**
 * @template T
 * @param {ReadonlyArray<T>} values
 * @param {Map<T>} map
 * @param {Options | undefined} [options]
 * @returns {Element}
 */
export function list(values, map, options) {
  return h(
    '.block-big',
    {},
    h('ol.flow-big.cards', {}, baseList(values, map, options))
  )
}
