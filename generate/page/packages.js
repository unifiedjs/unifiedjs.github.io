/**
 * @import {Root} from 'hast'
 * @import {Data} from '../data.js'
 */

import {h} from 'hastscript'
import {helperSort} from '../component/package/helper-sort.js'
import {list} from '../component/package/list.js'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {page} from './page.js'

/**
 * @param {Data} data
 * @returns {Root}
 */
export function packages(data) {
  return page(
    h('.row-l.column-l', {}, h('h2', {}, breadcrumbs('/explore/package'))),
    [
      h('.content', {}, h('h3', 'All packages')),
      list(data, helperSort(data, Object.keys(data.packageByName)))
    ]
  )
}
