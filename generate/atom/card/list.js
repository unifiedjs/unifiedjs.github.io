import h from 'hastscript'
import {list as baseList} from '../macro/list.js'

export function list(values, map, options) {
  return h('.block-big', h('ol.flow-big.cards', baseList(values, map, options)))
}
