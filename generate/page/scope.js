import {h} from 'hastscript'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {detail} from '../component/scope/detail.js'
import {page} from './page.js'

export function scope(data, d) {
  return page(
    h('.row-l.column-l', {}, h('h2', {}, breadcrumbs('/explore/package/' + d))),
    detail(data, d)
  )
}
