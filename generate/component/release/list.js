import {h} from 'hastscript'
import {list as macroList} from '../../atom/macro/list.js'
import {item} from './item.js'
import {more} from './more.js'

export function list(data, releases, options) {
  return h('ol.releases', macroList(releases, map, {more, ...options}))

  function map(d) {
    return item(data, d)
  }
}
