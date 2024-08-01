/**
 * @import {Root} from 'hast'
 * @import {Data} from '../data.js'
 */

import {h} from 'hastscript'
import {detail} from '../component/scope/detail.js'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {page} from './page.js'

/**
 * @param {Data} data
 * @param {string} d
 * @returns {Root}
 */
export function scope(data, d) {
  return page(
    h('.row-l.column-l', {}, h('h2', {}, breadcrumbs('/explore/package/' + d))),
    detail(data, d)
  )
}
