/**
 * @import {ElementContent} from 'hast'
 */

import {h} from 'hastscript'
import {fmtCompact} from '../../util/fmt-compact.js'
import {stars as icon} from '../icon/stars.js'

/**
 * @param {number} value
 * @param {string | undefined} [name]
 * @returns {ElementContent}
 */
export function stars(value, name) {
  /** @type {Array<ElementContent | string> | ElementContent} */
  let node = [icon(), ' ', fmtCompact(value)]

  if (name) {
    node = h(
      'a.tap-target',
      {href: 'https://github.com/' + name + '/stargazers'},
      node
    )
  }

  return h('li', {}, node)
}
