/**
 * @import {ElementContent, Element} from 'hast'
 * @import {Data} from '../../data.js'
 */

import {h} from 'hastscript'
import {itemSmall} from './item-small.js'

/**
 * @param {Data} data
 * @param {ReadonlyArray<string>} list
 * @returns {Element}
 */
export function listSmall(data, list) {
  /** @type {Array<ElementContent>} */
  const results = []

  for (const d of list) {
    results.push(itemSmall(data, d))
  }

  return h('.block', {}, h('ol.flow', {}, results))
}
