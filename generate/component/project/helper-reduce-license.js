/**
 * @import {Data} from '../../data.js'
 */

import {unique} from '../../util/unique.js'

/**
 * @param {Data} data
 * @param {string} repo
 * @returns {string | undefined}
 */
export function helperReduceLicense(data, repo) {
  const {packagesByRepo, packageByName} = data
  const licenses =
    packagesByRepo[repo]
      ?.map((d) => packageByName[d].license)
      .filter(Boolean)
      .filter(unique) || []

  const main = licenses[0] || undefined

  return licenses.length > 1 ? '±' + main : main
}
