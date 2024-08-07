/**
 * @import {Element} from 'hast'
 * @import {Data} from '../../data.js'
 */

import {h} from 'hastscript'
import {more} from '../../atom/box/more.js'
import {list} from '../project/list.js'
import {helperSort} from '../project/helper-sort.js'

/**
 * @param {Data} data
 * @param {string} d
 * @returns {Array<Element>}
 */
export function detail(data, d) {
  const {projectsByOwner} = data

  const trail = more(
    'https://github.com/search?o=desc&s=stars&type=Repositories&q=user:' + d,
    ['Find other projects by owner @', d, ' on GitHub']
  )

  return [
    h('.content', {}, h('h3', ['Projects by owner @', d])),
    list(data, helperSort(data, projectsByOwner[d]), {trail})
  ]
}
