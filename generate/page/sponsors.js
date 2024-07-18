import {h} from 'hastscript'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {list} from '../component/sponsor/list.js'
import {byline} from '../component/sponsor/byline.js'
import {page} from './page.js'

export function sponsor(sponsors) {
  return page(
    h('.row-l.column-l', {}, h('h2', {}, breadcrumbs('/community/sponsor/'))),
    [h('.article.content', [h('h3', 'Sponsors'), byline()]), list(sponsors)]
  )
}
