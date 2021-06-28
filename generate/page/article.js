import {h} from 'hastscript'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {detail} from '../component/article/detail.js'
import {page} from './page.js'

export function article(tree, file) {
  var {matter, meta} = file.data
  var {title} = matter
  var {pathname} = meta

  return page(h('.row-l.column-l', h('h2', breadcrumbs(pathname, title))), [
    detail(tree, file)
  ])
}
