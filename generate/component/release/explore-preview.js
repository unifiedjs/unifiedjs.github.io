import {more} from '../../atom/box/more.js'
import {releases} from '../../../data/releases.js'
import {list} from './list.js'
import {helperFilter} from './helper-filter.js'
import {helperSort} from './helper-sort.js'

export function explorePreview(data) {
  return list(
    data,
    helperFilter(data, helperSort(data, releases)).slice(0, 3),
    {trail: more('/explore/release/', 'Explore recent releases')}
  )
}
