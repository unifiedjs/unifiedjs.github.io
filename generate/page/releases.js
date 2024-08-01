/**
 * @import {Root} from 'hast'
 * @import {Data} from '../data.js'
 */

import {h} from 'hastscript'
import {releases as dataReleases} from '../../data/releases.js'
import {helperFilter} from '../component/release/helper-filter.js'
import {helperSort} from '../component/release/helper-sort.js'
import {list} from '../component/release/list.js'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {page} from './page.js'

/**
 * @param {Data} data
 * @returns {Root}
 */
export function releases(data) {
  return page(
    h('.row-l.column-l', {}, h('h2', {}, breadcrumbs('/explore/release/'))),
    list(data, helperFilter(data, helperSort(data, dataReleases)))
  )
}
