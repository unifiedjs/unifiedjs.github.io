/**
 * @import {Element} from 'hast'
 */

import {h} from 'hastscript'

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
    h('a', {href: 'https://github.com/sponsors/unifiedjs'}, 'GitHub'),
    ', ',
    h('a', {href: 'https://thanks.dev'}, h('code', 'thanks.dev')),
    ', or ',
    h('a', {href: 'http://opencollective.com/unified'}, 'OpenCollective'),
    '.'
  ])
}
