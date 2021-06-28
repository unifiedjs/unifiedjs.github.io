import h from 'hastscript'
import {fmtCompact} from '../../util/fmt-compact.js'
import {downloads as icon} from '../icon/downloads.js'

export function downloads(value, name) {
  var node

  if (!value) {
    return []
  }

  node = [icon(), ' ', fmtCompact(value)]

  if (name) {
    node = h('a.tap-target', {href: 'https://www.npmtrends.com/' + name}, node)
  }

  return h('li', node)
}
