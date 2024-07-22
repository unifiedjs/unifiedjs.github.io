/**
 * @import {Element} from 'hast'
 */

import {h} from 'hastscript'

const oc = 'http://opencollective.com/unified'

/**
 * @returns {Element}
 */
export function byline() {
  return h('p', [
    'Maintaining the collective, developing new projects, keeping everything ',
    'fast and secure, and helping users, is a lot of work. ',
    'Financial support lets the team spend more time maintaining existing ',
    'projects and developing new ones. ',
    'To support unified, become a sponsor or backer on ',
    h('a', {href: oc}, 'OpenCollective'),
    '.'
  ])
}
