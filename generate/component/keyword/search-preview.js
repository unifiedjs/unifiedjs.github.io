'use strict'

var h = require('hastscript')

module.exports = preview

function preview() {
  return h('p.content', [
    'Explore the packages in the ecosystem by ',
    h('a', {href: '/explore/keyword/'}, 'keyword'),
    '.'
  ])
}
