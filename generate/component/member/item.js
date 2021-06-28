import {h} from 'hastscript'
import {gh as ghBadge} from '../../atom/micro/gh.js'
import {npm as npmBadge} from '../../atom/micro/npm.js'
import {url as urlLine} from '../../atom/micro/url.js'
import {item as card} from '../../atom/card/item.js'

const base = 'https://github.com/'

export function item(data, d) {
  const {name, github, npm, url} = d
  const footer = [ghBadge(github)]
  const memberships = []

  if (npm) {
    footer.push(npmBadge('~' + npm))
  }

  if (url) {
    footer.push(urlLine(url))
  }

  data.teams.forEach((team) => {
    const role = team.humans[github]
    if (role && role !== 'contributor') {
      memberships.push(h(team.collective ? 'b' : 'span', team.name))
    }
  })

  const roles = memberships.flatMap((d, i, all) => {
    return [d, i === all.length - 1 ? '' : ', ']
  })

  return card(
    base + github,
    h('.column', [
      h('h3.row', [
        h('.thumbnail', {
          role: 'presentation',
          style: 'background-image:url(' + base + github + '.png?size=64)'
        }),
        h('span.ellipsis', name)
      ]),
      h(
        'p.double-ellipsis',
        roles.length === 0
          ? 'Contributor'
          : [h('span.label', 'Teams: ')].concat(roles)
      )
    ]),
    footer
  )
}
