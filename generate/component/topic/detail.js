/**
 * @import {ElementContent} from 'hast'
 * @import {Data} from '../../data.js'
 */

import {h} from 'hastscript'
import {more} from '../../atom/box/more.js'
import {helperSort} from '../project/helper-sort.js'
import {list} from '../project/list.js'

/**
 * @param {Data} data
 * @param {string} d
 * @returns {Array<ElementContent>}
 */
export function detail(data, d) {
  const {projectsByTopic} = data

  const trail = more('https://github.com/topics/' + d, [
    'Find other projects matching ',
    h('span.tag', {}, d),
    ' on GitHub'
  ])

  return [
    h('.content', {}, h('h3', ['Projects matching ', d])),
    list(data, helperSort(data, projectsByTopic[d]), {trail})
  ]
}
