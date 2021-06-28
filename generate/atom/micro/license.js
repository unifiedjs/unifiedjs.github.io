import spdx from 'spdx-license-list'
import h from 'hastscript'
import {license as icon} from '../icon/license.js'

export function license(value) {
  var url = value in spdx ? spdx[value].url : null
  var node = value ? [icon(), ' ', value] : ''

  if (url) {
    node = h('a.tap-target', {href: url}, node)
  }

  return node ? h('li', node) : ''
}
