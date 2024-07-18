import {h} from 'hastscript'
import {block} from '../macro/block.js'

export function item(href, main, footer) {
  return block(
    h('a.card', {href}, main),
    footer ? h('ol.row', {}, footer) : undefined
  )
}
