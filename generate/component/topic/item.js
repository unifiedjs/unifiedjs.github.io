/**
 * @import {ElementContent} from 'hast'
 * @import {Data} from '../../data.js'
 */

import {h} from 'hastscript'
import {fmtCompact} from '../../util/fmt-compact.js'
import {fmtPlural} from '../../util/fmt-plural.js'
import {more as box} from '../../atom/box/more.js'
import {list} from '../project/list.js'
import {helperSort} from '../project/helper-sort.js'

/**
 * @param {Data} data
 * @param {string} d
 * @returns {Array<ElementContent>}
 */
export function item(data, d) {
  const {projectsByTopic} = data

  return [
    h('.content', {}, h('h3', {}, d)),
    list(data, helperSort(data, projectsByTopic[d]), {max: 3, more})
  ]

  /**
   * @param {number} rest
   * @returns {ElementContent}
   */
  function more(rest) {
    return box('/explore/topic/' + d + '/', [
      'Explore ',
      fmtCompact(rest),
      ' other ',
      fmtPlural(rest, {one: 'project', other: 'projects'}),
      ' matching ',
      h('span.tag', {}, d)
    ])
  }
}
