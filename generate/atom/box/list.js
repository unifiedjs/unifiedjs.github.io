import {h} from 'hastscript'
import {list as baseList} from '../macro/list.js'

export function list(names, map, options) {
  return h('.block', {}, h('ol.flow.boxes', {}, baseList(names, map, options)))
}
