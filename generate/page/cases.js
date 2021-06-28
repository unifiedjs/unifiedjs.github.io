import h from 'hastscript'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {list} from '../component/case/list.js'
import {byline} from '../component/case/byline.js'
import {page} from './page.js'

export function cases(showcase) {
  return page(h('.row-l.column-l', h('h2', breadcrumbs('/community/case/'))), [
    h('.article.content', [h('h3', 'Showcase'), byline()]),
    list(showcase)
  ])
}
