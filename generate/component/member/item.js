/**
 * @import {ElementContent, Element} from 'hast'
 * @import {Human} from '../../../data/humans.js'
 * @import {CommunityData} from '../../index.js'
 */

import {h} from 'hastscript'
import {item as card} from '../../atom/card/item.js'
import {gh as ghBadge} from '../../atom/micro/gh.js'
import {npm as npmBadge} from '../../atom/micro/npm.js'
import {url as urlLine} from '../../atom/micro/url.js'

const base = 'https://github.com/'

/**
 * @param {CommunityData} data
 * @param {Human} d
 * @returns {Element}
 */
export function item(data, d) {
  const {github, name, npm, url} = d
  /** @type {Array<ElementContent>} */
  const footer = [ghBadge(github)]

  if (npm) {
    footer.push(npmBadge('~' + npm))
  }

  if (url) {
    footer.push(urlLine(url))
  }

  /** @type {Array<ElementContent | string>} */
  const memberships = []

  for (const team of data.teams) {
    const role = team.humans[github]

    if (role && role !== 'contributor') {
      const node = h(team.collective ? 'b' : 'span', team.name)
      if (memberships.length > 0) memberships.push(', ')
      memberships.push(node)
    }
  }

  return card(
    base + github,
    h('.column', [
      h('h3.row', [
        h('.thumbnail', {
          role: 'presentation',
          style: 'background-image:url(' + base + github + '.png?size=64)'
        }),
        h('span.ellipsis', {}, name)
      ]),
      h(
        'p.double-ellipsis',
        memberships.length === 0
          ? 'Contributor'
          : [h('span.label', 'Teams: '), ...memberships]
      )
    ]),
    footer
  )
}
