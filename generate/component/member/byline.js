'use strict'

var h = require('hastscript')

module.exports = byline

var slug = 'unifiedjs/collective'
var collective = 'https://github.com/' + slug + '/'

function byline() {
  return h('p', [
    'The unified collective is a federated system of organizations, ',
    'consisting in turn of projects, governed by the team members ',
    'steering them. ',
    'The members govern the collective through a consensus seeking ',
    'decision making model, described in detail at ',
    h('a', {href: collective}, h('code', slug)),
    '. '
  ])
}
