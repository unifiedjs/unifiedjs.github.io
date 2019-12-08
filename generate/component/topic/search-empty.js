'use strict'

var h = require('hastscript')

module.exports = empty

function empty(data, query) {
  return h('p.content', [
    'We couldn’t find any topics matching “',
    query,
    '”. ',
    h('a', {href: '/explore/topic/'}, 'Browse topics'),
    ' instead.'
  ])
}
