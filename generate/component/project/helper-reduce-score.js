/**
 * @import {Data} from '../../data.js'
 */

/**
 * @param {Data} data
 * @param {string} repo
 * @returns {number}
 */
export function helperReduceScore(data, repo) {
  const {packagesByRepo, packageByName} = data
  const list = packagesByRepo[repo]
  let all = 0

  if (list) {
    for (const d of list) {
      const score = packageByName[d].score
      if (score > all) all = score
    }
  }

  return all
}
