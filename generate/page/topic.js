import {h} from 'hastscript'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {detail} from '../component/topic/detail.js'
import {page} from './page.js'

export function topic(data, d) {
  return page(
    h('.row-l.column-l', {}, h('h2', {}, breadcrumbs('/explore/topic/' + d))),
    detail(data, d)
  )
}
