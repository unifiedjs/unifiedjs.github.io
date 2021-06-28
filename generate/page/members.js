import {h} from 'hastscript'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {byline} from '../component/member/byline.js'
import {list} from '../component/member/list.js'
import {helperSort} from '../component/member/helper-sort.js'
import {page} from './page.js'

export function members(data) {
  return page(
    h('.row-l.column-l', h('h2', breadcrumbs('/community/member/'))),
    [
      h('.article.content', [h('h3', 'Team'), byline()]),
      list(data, helperSort(data, data.humans))
    ]
  )
}
