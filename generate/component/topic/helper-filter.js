/**
 * @import {Data} from '../../data.js'
 */

const defaults = 1

/**
 * Filter topics for enough use.
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
    const projects = data.projectsByTopic[d]

    if (projects && projects.length > value) {
      results.push(d)
    }
  }

  return results
}
