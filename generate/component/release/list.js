/**
 * @import {Element} from 'hast'
 * @import {Data} from '../../data.js'
 * @import {Options} from '../../atom/macro/list.js'
 * @import {Release} from '../../../data/releases.js'
 */

import {h} from 'hastscript'
import {list as macroList} from '../../atom/macro/list.js'
import {item} from './item.js'
import {more} from './more.js'

/**
 * @param {Data} data
 * @param {ReadonlyArray<Release>} releases
 * @param {Options | undefined} [options]
 * @returns {Element}
 */
export function list(data, releases, options) {
  return h('ol.releases', {}, macroList(releases, map, {more, ...options}))

  /**
   * @param {Release} d
   * @returns {Element}
   */
  function map(d) {
    return item(data, d)
  }
}
