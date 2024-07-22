/**
 * @import {Data} from '../../data.js'
 */

import {sort} from '../../util/sort.js'

/**
 * Sort packages by score.
 *
 * @param {Data} data
 * @param {ReadonlyArray<string>} names
 * @returns {Array<string>}
 */
export function helperSort(data, names) {
  const {packageByName} = data

  return sort(names, score)

  /**
   * @param {string} d
   * @returns {number}
   */
  function score(d) {
    return packageByName[d].score || 0
  }
}
