import {list as cards} from '../../atom/card/list.js'
import {item} from './item.js'
import {more} from './more.js'

export function list(d, options) {
  return cards(d, item, {more, ...options})
}
