/**
 * @import {ElementContent, Element} from 'hast'
 */

import {h} from 'hastscript'

/**
 * @param {Array<ElementContent> | ElementContent} main
 * @param {Array<ElementContent> | ElementContent | undefined} [footer]
 * @returns {Element}
 */
export function block(main, footer) {
  /** @type {Array<ElementContent>} */
  const children = []
  if (Array.isArray(main)) children.push(...main)
  else if (main) children.push(main)
  if (footer) children.push(h('.nl-foot', {}, footer))
  return h('li', {className: footer ? ['nl-root'] : []}, children)
}
