/**
 * @import {Root} from 'hast'
 * @import {Person} from '../../data/sponsors.js'
 */

import {h} from 'hastscript'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {byline} from '../component/sponsor/byline.js'
import {list} from '../component/sponsor/list.js'
import {page} from './page.js'

/**
 * @param {ReadonlyArray<Person>} sponsors
 * @returns {Root}
 */
export function sponsor(sponsors) {
  return page(
    h('.row-l.column-l', {}, h('h2', {}, breadcrumbs('/community/sponsor/'))),
    [h('.article.content', [h('h3', 'Sponsors'), byline()]), list(sponsors)]
  )
}
