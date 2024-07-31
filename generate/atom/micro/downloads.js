/**
 * @import {ElementContent} from 'hast'
 */

import {h} from 'hastscript'
import {fmtCompact} from '../../util/fmt-compact.js'
import {downloads as icon} from '../icon/downloads.js'

/**
 * @param {number | undefined} value
 * @param {string | undefined} [name]
 * @returns {Array<ElementContent> | ElementContent}
 */
export function downloads(value, name) {
  if (!value) {
    return []
  }

  /** @type {Array<ElementContent | string> | ElementContent} */
  let node = [icon(), ' ', fmtCompact(value)]

  if (name) {
    node = h('a.tap-target', {href: 'https://www.npmtrends.com/' + name}, node)
  }

  return h('li', {}, node)
}
