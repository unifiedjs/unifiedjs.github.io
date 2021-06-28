import {h} from 'hastscript'
import {fmtCompact} from '../../util/fmt-compact.js'
import {stars as icon} from '../icon/stars.js'

export function stars(value, name) {
  var node = [icon(), ' ', fmtCompact(value)]

  if (name) {
    node = h(
      'a.tap-target',
      {href: 'https://github.com/' + name + '/stargazers'},
      node
    )
  }

  return h('li', node)
}
