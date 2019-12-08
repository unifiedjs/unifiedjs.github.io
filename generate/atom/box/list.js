'use strict'

var h = require('hastscript')
var list = require('../macro/list')

module.exports = boxes

function boxes(names, map, options) {
  return h('.block', h('ol.flow.boxes', list(names, map, options)))
}
