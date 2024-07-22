/**
 * @import {Data} from '../../data.js'
 * @import {Release} from '../../../data/releases.js'
 */

import {sort} from '../../util/sort.js'

/**
 * Sort releases by published.
 *
 * @param {Data} data
 * @param {ReadonlyArray<Release>} releases
 * @returns {Array<Release>}
 */
export function helperSort(data, releases) {
  return sort(releases, score)

  /**
   * @param {Release} d
   * @returns {number}
   */
  function score(d) {
    return new Date(d.published).valueOf()
  }
}
