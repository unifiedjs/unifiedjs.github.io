import {h} from 'hastscript'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {detail} from '../component/article/detail.js'
import {page} from './page.js'

export function article(tree, file) {
  const {matter, meta} = file.data
  const {title} = matter
  const {pathname} = meta

  return page(h('.row-l.column-l', h('h2', breadcrumbs(pathname, title))), [
    detail(tree, file)
  ])
}
