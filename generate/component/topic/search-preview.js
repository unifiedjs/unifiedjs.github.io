'use strict'

var h = require('hastscript')

module.exports = preview

function preview() {
  return h('p.content', [
    'Explore the projects in the ecosystem by ',
    h('a', {href: '/explore/topic/'}, 'topic'),
    '.'
  ])
}
