/**
 * @import {ElementContent, Element} from 'hast'
 * @import {Human} from '../../../data/humans.js'
 * @import {CommunityData} from '../../index.js'
 */

import {h} from 'hastscript'
import {gh as ghBadge} from '../../atom/micro/gh.js'
import {npm as npmBadge} from '../../atom/micro/npm.js'
import {url as urlLine} from '../../atom/micro/url.js'
import {item as card} from '../../atom/card/item.js'

const base = 'https://github.com/'

/**
 * @param {CommunityData} data
 * @param {Human} d
 * @returns {Element}
 */
export function item(data, d) {
  const {name, github, npm, url} = d
  /** @type {Array<ElementContent>} */
  const footer = [ghBadge(github)]
  /** @type {Array<ElementContent>} */
  const memberships = []

  if (npm) {
    footer.push(npmBadge('~' + npm))
  }

  if (url) {
    footer.push(urlLine(url))
  }

  for (const team of data.teams) {
    const role = team.humans[github]
    if (role && role !== 'contributor') {
      memberships.push(h(team.collective ? 'b' : 'span', team.name))
    }
  }

  const roles = memberships.flatMap((d, index, all) => [
    d,
    index === all.length - 1 ? '' : ', '
  ])

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
        roles.length === 0
          ? 'Contributor'
          : [h('span.label', 'Teams: '), ...roles]
      )
    ]),
    footer
  )
}
