/**
 * @import {VFile} from 'vfile'
 */

import {asc} from '../../util/sort.js'

/**
 * Sort articles by index.
 *
 * @param {ReadonlyArray<VFile>} data
 * @returns {Array<VFile>}
 */
export function helperSort(data) {
  return asc(data, score)
}

/**
 * @param {VFile} d
 * @returns {number}
 */
function score(d) {
  const matter = d.data.matter || {}
  return matter.index || Number.POSITIVE_INFINITY
}
