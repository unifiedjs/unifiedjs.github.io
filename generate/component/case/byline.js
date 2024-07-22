/**
 * @import {Element} from 'hast'
 */

import {h} from 'hastscript'

/**
 * @returns {Element}
 */
export function byline() {
  return h('p', [
    'Thousands of interesting projects are made with unified, mixing and ',
    'matching building blocks together. ',
    'A couple of interesting cases made with unified are shown here.'
  ])
}
