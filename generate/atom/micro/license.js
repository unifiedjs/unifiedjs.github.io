// To do: remove? Unused?

/**
 * @import {ElementContent, Element} from 'hast'
 */

import spdx from 'spdx-license-list'
import {h} from 'hastscript'
import {license as icon} from '../icon/license.js'

/**
 * @param {string | undefined} value
 * @returns {Array<ElementContent> | ElementContent}
 */
export function license(value) {
  const url = value && value in spdx ? spdx[value].url : null
  /** @type {Array<ElementContent | string> | Element | string} */
  let node = value ? [icon(), ' ', value] : ''

  if (url) {
    node = h('a.tap-target', {href: url}, node)
  }

  return node ? h('li', {}, node) : []
}
