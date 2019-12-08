'use strict'

var h = require('hastscript')

module.exports = empty

function empty(data, query) {
  return h('p.content', [
    'We couldn’t find any keywords matching “',
    query,
    '”. ',
    h('a', {href: '/explore/keyword/'}, 'Browse keywords'),
    ' instead.'
  ])
}
