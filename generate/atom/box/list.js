/**
 * @import {Element} from 'hast'
 * @import {Map, Options} from '../macro/list.js'
 */

import {h} from 'hastscript'
import {list as baseList} from '../macro/list.js'

/**
 * @template T
 * @param {ReadonlyArray<T>} names
 * @param {Map<T>} map
 * @param {Options | undefined} [options]
 * @returns {Element}
 */
export function list(names, map, options) {
  return h('.block', {}, h('ol.flow.boxes', {}, baseList(names, map, options)))
}
