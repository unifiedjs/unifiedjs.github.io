/**
 * @import {Data} from '../../data.js'
 * @import {Release} from '../../../data/releases.js'
 */

// 60 days.
const defaults = 60 * 24 * 60 * 60 * 1000

/**
 * Filter releases for recently published.
 *
 * @param {Data} data
 * @param {ReadonlyArray<Release>} releases
 * @param {number | undefined} [ms]
 * @returns {Array<Release>}
 */
export function helperFilter(data, releases, ms) {
  const {projectByRepo} = data
  const value = Date.now() - (ms || defaults)

  return releases.filter(filter)

  /**
   * @param {Release} d
   * @returns {boolean}
   */
  function filter(d) {
    return projectByRepo[d.repo] && new Date(d.published).valueOf() > value
  }
}
