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
  const value = min || defaults
  /** @type {Array<string>} */
  const results = []

  for (const d of names) {
    if (
      Object.hasOwn(data.packagesByKeyword, d) &&
      data.packagesByKeyword[d].length > value
    ) {
      results.push(d)
    }
  }

  return results
}
