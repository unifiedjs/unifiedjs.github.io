import {list as macros} from '../../atom/macro/list.js'
import {item} from './item.js'

export function list(data, d, options) {
  return macros(d, map, options)
  function map(d) {
    return item(data, d)
  }
}
