/**
 * @import {ElementContent} from 'hast'
 * @import {Data} from '../../data.js'
 */

import {more} from '../../atom/box/more.js'
import {fmtCompact} from '../../util/fmt-compact.js'
import {pickRandom} from '../../util/pick-random.js'
import {list} from './list.js'
import {helperSort} from './helper-sort.js'

/**
 * @param {Data} data
 * @returns {ElementContent}
 */
export function searchPreview(data) {
  const {projectByRepo} = data
  const names = helperSort(data, Object.keys(projectByRepo))
  const d = pickRandom(names.slice(0, 75), 5)

  const trail = more('/explore/project/', [
    'Explore the ',
    fmtCompact(names.length),
    ' projects in the ecosystem'
  ])

  return list(data, d, {trail})
}
