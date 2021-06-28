import {h} from 'hastscript'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {list} from '../component/package/list.js'
import {helperSort} from '../component/package/helper-sort.js'
import {page} from './page.js'

export function packages(data) {
  return page(h('.row-l.column-l', h('h2', breadcrumbs('/explore/package'))), [
    h('.content', h('h3', 'All packages')),
    list(data, helperSort(data, Object.keys(data.packageByName)))
  ])
}
