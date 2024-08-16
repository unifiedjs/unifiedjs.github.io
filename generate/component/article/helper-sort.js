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
  const published =
    typeof matter.published === 'string'
      ? new Date(matter.published)
      : matter.published || undefined
  return matter.index || published?.getTime() || Number.POSITIVE_INFINITY
}
