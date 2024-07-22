/**
 * @import {Data} from '../../data.js'
 */

import {sort} from '../../util/sort.js'

/**
 * Sort keywords by occurrence.
 *
 * @param {Data} data
 * @param {ReadonlyArray<string>} names
 * @returns {Array<string>}
 */
export function helperSort(data, names) {
  const {packagesByKeyword} = data

  return sort(names, score)

  /**
   * @param {string} d
   * @returns {number}
   */
  function score(d) {
    return (packagesByKeyword[d] || []).length
  }
}
