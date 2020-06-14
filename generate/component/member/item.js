'use strict'

var h = require('hastscript')
var ghBadge = require('../../atom/micro/gh')
var npmBadge = require('../../atom/micro/npm')
var urlLine = require('../../atom/micro/url')
var card = require('../../atom/card/item')

module.exports = item

var base = 'https://github.com/'

function item(data, d) {
  var {name, github, npm, url} = d
  var footer = [ghBadge(github)]
  var memberships = []

  if (npm) {
    footer.push(npmBadge('~' + npm))
  }

  if (url) {
    footer.push(urlLine(url))
  }

  data.teams.forEach((team) => {
    var role = team.humans[github]
    if (role && role !== 'contributor') {
      memberships.push(h(team.collective ? 'b' : 'span', team.name))
    }
  })

  var roles = memberships.flatMap((d, i, all) => {
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
