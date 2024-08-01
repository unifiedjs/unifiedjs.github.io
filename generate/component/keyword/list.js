/**
 * @import {ElementContent} from 'hast'
 * @import {Data} from '../../data.js'
 * @import {Options} from '../../atom/macro/list.js'
 */

import {list as macroList} from '../../atom/macro/list.js'
import {item} from './item.js'

/**
 * @param {Data} data
 * @param {ReadonlyArray<string>} d
 * @param {Options | undefined} [options]
 * @returns {Array<ElementContent>}
 */
export function list(data, d, options) {
  return macroList(d, map, options)

  /**
   * @param {string} d
   * @returns {Array<ElementContent>}
   */
  function map(d) {
    return item(data, d)
  }
}
