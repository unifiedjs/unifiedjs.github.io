/**
 * @import {Element} from 'hast'
 */

import {h} from 'hastscript'

const slug = 'unifiedjs/collective'

/**
 * @returns {Element}
 */
export function byline() {
  return h('p', [
    'The unified collective is a federated system of organizations, ',
    'consisting in turn of projects, governed by the team members ',
    'steering them. ',
    'The members govern the collective through a consensus seeking ',
    'decision making model, described in detail at ',
    h('a', {href: 'https://github.com/' + slug + '/'}, h('code', {}, slug)),
    '. '
  ])
}
