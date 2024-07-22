/**
 * @import {Root} from 'hast'
 * @import {Data} from '../data.js'
 */

import {h} from 'hastscript'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {list} from '../component/project/list.js'
import {helperSort} from '../component/project/helper-sort.js'
import {page} from './page.js'

/**
 * @param {Data} data
 * @returns {Root}
 */
export function projects(data) {
  return page(
    h('.row-l.column-l', {}, h('h2', {}, breadcrumbs('/explore/project/'))),
    [
      h('.content', {}, h('h3', 'All projects')),
      list(data, helperSort(data, Object.keys(data.projectByRepo)))
    ]
  )
}
