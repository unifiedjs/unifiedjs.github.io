/**
 * @import {Root} from 'hast'
 * @import {CommunityData} from '../index.js'
 */

import {h} from 'hastscript'
import {byline} from '../component/member/byline.js'
import {helperSort} from '../component/member/helper-sort.js'
import {list} from '../component/member/list.js'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {page} from './page.js'

/**
 * @param {CommunityData} data
 * @returns {Root}
 */
export function members(data) {
  return page(
    h('.row-l.column-l', {}, h('h2', {}, breadcrumbs('/community/member/'))),
    [
      h('.article.content', [h('h3', 'Team'), byline()]),
      list(data, helperSort(data, data.humans))
    ]
  )
}
