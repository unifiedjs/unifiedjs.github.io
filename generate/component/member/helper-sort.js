/**
 * @import {Human} from '../../../data/humans.js'
 * @import {Role} from '../../../data/teams.js'
 * @import {CommunityData} from '../../index.js'
 */

import {sort} from '../../util/sort.js'

const collective = {false: 1, true: 4}
/** @type {Partial<Record<Role, number>>} */
const roles = {maintainer: 2, merger: 2, releaser: 3}

/**
 * Sort humans by “influence”.
 *
 * @param {CommunityData} data
 * @param {ReadonlyArray<Human>} d
 * @returns {Array<Human>}
 */
export function helperSort(data, d) {
  /** @type {Record<string, number>} */
  const scores = {}

  for (const team of data.teams) {
    const members = team.humans

    for (const [d, role] of Object.entries(members)) {
      const active = Boolean(team.collective && role === 'maintainer')

      scores[d] =
        (scores[d] || 0) +
        (roles[role] || 1) *
          // Note: ternary is just for TS, JS works fine without it.
          collective[active ? 'true' : 'false']
    }
  }

  return sort(d, score)

  /**
   * @param {Human} d
   * @returns {number}
   */
  function score(d) {
    return scores[d.github]
  }
}
