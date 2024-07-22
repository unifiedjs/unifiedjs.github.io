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
  const {projectsByTopic} = data
  const value = min || defaults

  return names.filter(filter)

  /**
   * @param {string} d
   * @returns {boolean}
   */
  function filter(d) {
    return (projectsByTopic[d] || []).length > value
  }
}
