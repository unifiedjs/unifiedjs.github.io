/**
 * @import {Root} from 'hast'
 * @import {Data} from '../data.js'
 */

import {h} from 'hastscript'
import {detail} from '../component/keyword/detail.js'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {page} from './page.js'

/**
 * @param {Data} data
 * @param {string} d
 * @returns {Root}
 */
export function keyword(data, d) {
  return page(
    h('.row-l.column-l', {}, h('h2', {}, breadcrumbs('/explore/keyword/' + d))),
    detail(data, d)
  )
}
