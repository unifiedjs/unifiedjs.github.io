/**
 * @import {Data} from '../../data.js'
 */

/**
 *
 * @param {Data} data
 * @param {string} repo
 * @returns {number}
 */
export function helperReduceDownloads(data, repo) {
  const {packageByName, packagesByRepo} = data

  return packagesByRepo[repo]?.reduce(sum, 0) || 0

  /**
   * @param {number} all
   * @param {string} d
   * @returns {number}
   */
  function sum(all, d) {
    return all + (packageByName[d].downloads || 0)
  }
}
