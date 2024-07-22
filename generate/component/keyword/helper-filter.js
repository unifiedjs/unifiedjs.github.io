/**
 * @import {Data} from '../../data.js'
 */

const defaults = 1

/**
 * Filter keywords for enough use.
 *
 * @param {Data} data
 * @param {ReadonlyArray<string>} names
 * @param {number | undefined} [min]
 * @returns {Array<string>}
 */
export function helperFilter(data, names, min) {
  const {packagesByKeyword} = data
  const value = min || defaults

  return names.filter(filter)

  /**
   * @param {string} d
   * @returns {boolean}
   */
  function filter(d) {
    return (packagesByKeyword[d] || []).length > value
  }
}
