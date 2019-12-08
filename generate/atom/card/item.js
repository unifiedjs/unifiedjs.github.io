'use strict'

var h = require('hastscript')
var block = require('../macro/block')

module.exports = item

function item(href, main, footer) {
  return block(
    h('a.card', {href}, main),
    footer ? h('ol.row', footer) : undefined
  )
}
