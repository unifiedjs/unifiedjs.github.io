import {list as boxes} from '../../atom/box/list.js'
import {item} from './item.js'
import {more} from './more.js'

export function list(data, names, options) {
  return boxes(names, map, {more, ...options})
  function map(d) {
    return item(data, d)
  }
}
