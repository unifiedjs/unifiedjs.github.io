// To do: remove? Unused?

/**
 * @import {ElementContent, Element} from 'hast'
 */

import {h} from 'hastscript'
import {fmtCompact} from '../../util/fmt-compact.js'

/**
 * @param {number} dependents
 * @param {string | undefined} [name]
 * @returns {Element}
 */
export function graph(dependents, name) {
  /** @type {Array<ElementContent | string> | Element} */
  let by = [h('span.label', 'Dependents: '), fmtCompact(dependents || 0)]

  if (name) {
    by = h(
      'a.tap-target',
      {href: 'https://www.npmjs.com/browse/depended/' + name},
      by
    )
  }

  return h('li', {}, by)
}
