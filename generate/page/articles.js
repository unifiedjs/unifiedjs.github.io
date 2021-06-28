import h from 'hastscript'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {list} from '../component/article/list.js'
import {helperSort} from '../component/article/helper-sort.js'
import {page} from './page.js'

export function articles(section, articles) {
  var {title, pathname, description} = section

  return page(h('.row-l.column-l', h('h2', breadcrumbs(pathname, title))), [
    h('.article.content', [h('h3', title), h('p', description)]),
    list(section, helperSort(articles))
  ])
}
