/**
 * @import {Element} from 'hast'
 * @import {Data} from '../../data.js'
 */

import {more} from '../../atom/box/more.js'
import {releases} from '../../../data/releases.js'
import {helperFilter} from './helper-filter.js'
import {helperSort} from './helper-sort.js'
import {list} from './list.js'

/**
 * @param {Data} data
 * @returns {Element}
 */
export function explorePreview(data) {
  return list(
    data,
    helperFilter(data, helperSort(data, releases)).slice(0, 3),
    {trail: more('/explore/release/', 'Explore recent releases')}
  )
}
