/**
 * @import {Root} from 'hast'
 * @import {Metadata} from '../component/case/item.js'
 */

import {h} from 'hastscript'
import {byline} from '../component/case/byline.js'
import {list} from '../component/case/list.js'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {page} from './page.js'

/**
 * @param {ReadonlyArray<Metadata>} showcase
 * @returns {Root}
 */
export function cases(showcase) {
  return page(
    h('.row-l.column-l', {}, h('h2', {}, breadcrumbs('/community/case/'))),
    [h('.article.content', [h('h3', 'Showcase'), byline()]), list(showcase)]
  )
}
