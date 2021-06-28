import {list as cards} from '../../atom/card/list.js'
import {helperSort} from './helper-sort.js'
import {item} from './item.js'
import {more} from './more.js'

export function list(data, d, options) {
  return cards(helperSort(data, d), map, {more, ...options})
  function map(d) {
    return item(data, d)
  }
}
