/**
 * @import {ElementContent, Element} from 'hast'
 */

import {h} from 'hastscript'
import {fmtBytes} from '../../util/fmt-bytes.js'

/**
 * @param {number | undefined} value
 * @param {string | undefined} [name]
 * @returns {Array<ElementContent> | ElementContent}
 */
export function gzip(value, name) {
  /** @type {Element | string} */
  let node = fmtBytes(value)

  if (name) {
    node = h(
      'a.tap-target',
      {href: 'https://bundlephobia.com/result?p=' + name},
      node
    )
  }

  return value ? h('li', {}, node) : []
}
