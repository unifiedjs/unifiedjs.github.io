import h from 'hastscript'
import {itemSmall} from './item-small.js'

export function listSmall(data, d) {
  return h('.block', h('ol.flow', d.map(map)))

  function map(d) {
    return itemSmall(data, d)
  }
}
