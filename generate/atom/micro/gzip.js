import h from 'hastscript'
import {fmtBytes} from '../../util/fmt-bytes.js'

export function gzip(value, name) {
  var node = fmtBytes(value)

  if (name) {
    node = h(
      'a.tap-target',
      {href: 'https://bundlephobia.com/result?p=' + name},
      node
    )
  }

  return value ? h('li', node) : ''
}
