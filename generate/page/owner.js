/**
 * @import {Root} from 'hast'
 * @import {Data} from '../data.js'
 */

import {h} from 'hastscript'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {detail} from '../component/owner/detail.js'
import {page} from './page.js'

/**
 * @param {Data} data
 * @param {string} d
 * @returns {Root}
 */
export function owner(data, d) {
  return page(
    h('.row-l.column-l', {}, h('h2', {}, breadcrumbs('/explore/project/' + d))),
    detail(data, d)
  )
}
