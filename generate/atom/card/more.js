import {h} from 'hastscript'
import {block} from '../macro/block.js'

export function more(href, children) {
  return block(h('a.card.more', {href}, h('.column', h('p', children))))
}
