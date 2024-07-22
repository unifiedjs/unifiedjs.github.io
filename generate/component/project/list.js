/**
 * @import {ElementContent, Element} from 'hast'
 * @import {Data} from '../../data.js'
 * @import {Options} from '../../atom/macro/list.js'
 */

import {list as boxes} from '../../atom/box/list.js'
import {item} from './item.js'
import {more} from './more.js'

/**
 * @param {Data} data
 * @param {ReadonlyArray<string>} names
 * @param {Options} [options]
 * @returns {Element}
 */
export function list(data, names, options) {
  return boxes(names, map, {more, ...options})

  /**
   * @param {string} d
   * @returns {ElementContent}
   */
  function map(d) {
    return item(data, d)
  }
}
