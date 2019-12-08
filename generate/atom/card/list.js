'use strict'

var h = require('hastscript')
var list = require('../macro/list')

module.exports = cards

function cards(names, map, options) {
  return h('.block-big', h('ol.flow-big.cards', list(names, map, options)))
}
