'use strict'

var h = require('hastscript')

module.exports = empty

function empty(data, query) {
  return h('p.content', [
    'We couldn’t find any projects matching “',
    query,
    '”. ',
    h('a', {href: '/explore/project/'}, 'Browse projects'),
    ' instead.'
  ])
}
