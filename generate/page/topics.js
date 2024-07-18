import {h} from 'hastscript'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {list} from '../component/topic/list.js'
import {helperFilter} from '../component/topic/helper-filter.js'
import {helperSort} from '../component/topic/helper-sort.js'
import {page} from './page.js'

export function topics(data) {
  return page(
    h('.row-l.column-l', {}, h('h2', {}, breadcrumbs('/explore/topic/'))),
    list(
      data,
      helperFilter(data, helperSort(data, Object.keys(data.projectsByTopic)), 2)
    )
  )
}
