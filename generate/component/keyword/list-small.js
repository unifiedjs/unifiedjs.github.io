/**
 * @import {ElementContent, Element} from 'hast'
 * @import {Data} from '../../data.js'
 */

import {h} from 'hastscript'
import {itemSmall} from './item-small.js'

/**
 * @param {Data} data
 * @param {ReadonlyArray<string>} d
 * @returns {Element}
 */
export function listSmall(data, d) {
  return h(
    '.block',
    {},
    h(
      'ol.flow',
      {},
      d.map(function (d) {
        return itemSmall(data, d)
      })
    )
  )
}
