/**
 * @import {ElementContent} from 'hast'
 */

import {h} from 'hastscript'

/**
 * @returns {ElementContent}
 */
export function searchPreview() {
  return h('p.content', [
    'Explore the packages in the ecosystem by ',
    h('a', {href: '/explore/keyword/'}, 'keyword'),
    '.'
  ])
}
