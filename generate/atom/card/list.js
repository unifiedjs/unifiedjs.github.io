'use strict'

var h = require('hastscript')
var list = require('../macro/list')

module.exports = cards

function cards(values, map, options) {
  return h('.block-big', h('ol.flow-big.cards', list(values, map, options)))
}
