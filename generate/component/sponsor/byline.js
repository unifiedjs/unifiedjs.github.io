'use strict'

var h = require('hastscript')

module.exports = byline

var oc = 'http://opencollective.com/unified'

function byline() {
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
