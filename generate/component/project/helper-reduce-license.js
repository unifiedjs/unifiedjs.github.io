/**
 * @import {Data} from '../../data.js'
 */

/**
 * @param {Data} data
 * @param {string} repo
 * @returns {string | undefined}
 */
export function helperReduceLicense(data, repo) {
  const {packagesByRepo, packageByName} = data
  let multi = false
  /** @type {string | undefined} */
  let main

  for (const d of packagesByRepo[repo]) {
    const license = packageByName[d].license

    if (!license) continue

    if (main && license !== main) {
      multi = true
      break
    }

    main = license
  }

  return multi ? '±' + main : main
}
