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

  if (!Object.hasOwn(packagesByRepo, repo)) {
    return 0
  }

  return packagesByRepo[repo]
    .map((d) => {
      return packageByName[d].score
    })
    .reduce((all, d) => (d > all ? d : all), 0)
}
