import h from 'hastscript'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {detail} from '../component/owner/detail.js'
import {page} from './page.js'

export function owner(data, d) {
  return page(
    h('.row-l.column-l', h('h2', breadcrumbs('/explore/project/' + d))),
    detail(data, d)
  )
}
