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
  const value = Date.now() - (ms || defaults)
  /** @type {Array<Release>} */
  const results = []

  for (const release of releases) {
    if (
      data.projectByRepo[release.repo] &&
      new Date(release.published).valueOf() > value
    ) {
      results.push(release)
    }
  }

  return results
}
