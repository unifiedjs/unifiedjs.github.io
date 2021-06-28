import {list as cards} from '../../atom/card/list.js'
import {item} from './item.js'
import {more} from './more.js'

export function list(section, d, options) {
  return cards(d, item, {more: map, ...options})
  function map(rest) {
    return more(section, rest)
  }
}
