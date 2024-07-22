/**
 * @import {Human} from '../../../data/humans.js'
 * @import {Element} from 'hast'
 * @import {Options} from '../../atom/macro/list.js'
 * @import {CommunityData} from '../../index.js'
 */

import {list as cards} from '../../atom/card/list.js'
import {helperSort} from './helper-sort.js'
import {item} from './item.js'
import {more} from './more.js'

/**
 * @param {CommunityData} data
 * @param {ReadonlyArray<Human>} d
 * @param {Options} [options]
 * @returns {Element}
 */
export function list(data, d, options) {
  return cards(helperSort(data, d), map, {more, ...options})
  /**
   * @param {Human} d
   * @returns {Element}
   */
  function map(d) {
    return item(data, d)
  }
}
