/**
 * @import {ElementContent, Root} from 'hast'
 */

import {h} from 'hastscript'

/**
 * @param {Array<ElementContent> | ElementContent | undefined} heading
 * @param {Array<ElementContent> | ElementContent | undefined} [main]
 * @returns {Root}
 */
export function page(heading, main) {
  return h(undefined, [
    heading && (!Array.isArray(heading) || heading.length > 0)
      ? h('section.container', {}, heading)
      : undefined,
    main && (!Array.isArray(main) || main.length > 0)
      ? h('main.container', {}, main)
      : undefined
  ])
}
