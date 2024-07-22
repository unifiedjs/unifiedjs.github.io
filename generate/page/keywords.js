/**
 * @import {Root} from 'hast'
 * @import {Data} from '../data.js'
 */

import {h} from 'hastscript'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {list} from '../component/keyword/list.js'
import {helperFilter} from '../component/keyword/helper-filter.js'
import {helperSort} from '../component/keyword/helper-sort.js'
import {page} from './page.js'

/**
 * @param {Data} data
 * @returns {Root}
 */
export function keywords(data) {
  return page(
    h('.row-l.column-l', {}, h('h2', {}, breadcrumbs('/explore/keyword/'))),
    list(
      data,
      helperFilter(
        data,
        helperSort(data, Object.keys(data.packagesByKeyword)),
        2
      )
    )
  )
}
