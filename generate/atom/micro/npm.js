import h from 'hastscript'
import {npm as icon} from '../icon/npm.js'

export function npm(name) {
  var node = icon()
  var href

  if (name) {
    href =
      'https://www.npmjs.com/' +
      (name.charAt(0) === '~' ? '' : 'package/') +
      name
    node = h('a.tap-target', {href}, node)
  }

  return h('li', node)
}
