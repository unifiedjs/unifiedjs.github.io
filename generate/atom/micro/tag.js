/**
 * @import {ElementContent} from 'hast'
 */

import {h} from 'hastscript'
import {fmtCompact} from '../../util/fmt-compact.js'

/**
 *
 * @param {string} label
 * @param {number | undefined} [count]
 * @param {string | undefined} [href]
 * @returns
 */
export function tag(label, count, href) {
  /** @type {Array<ElementContent | string>} */
  const nodes = [label]

  if (count) {
    nodes.push(' ', h('span.count', {}, fmtCompact(count)))
  }

  return h('li.inline-block', [
    href ? h('a.tag', {href}, nodes) : h('span.tag', {}, nodes)
  ])
}
