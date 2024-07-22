/**
 * @import {Data} from '../../data.js'
 */

import {sort} from '../../util/sort.js'
import {helperReduceScore} from './helper-reduce-score.js'

/**
 * Sort projects by score.
 *
 * @param {Data} data
 * @param {ReadonlyArray<string>} names
 * @returns {Array<string>}
 */
export function helperSort(data, names) {
  return sort(names, score)

  /**
   * @param {string} d
   * @returns {number}
   */
  function score(d) {
    return helperReduceScore(data, d)
  }
}
