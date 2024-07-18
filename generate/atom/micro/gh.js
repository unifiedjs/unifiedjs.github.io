import {h} from 'hastscript'
import {gh as icon} from '../icon/gh.js'

export function gh(name) {
  let node = icon()

  if (name) {
    node = h('a.tap-target', {href: 'https://github.com/' + name}, node)
  }

  return h('li', {}, node)
}
