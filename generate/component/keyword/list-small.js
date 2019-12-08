'use strict'

var h = require('hastscript')
var item = require('./item-small')

module.exports = list

function list(data, d) {
  return h('.block', h('ol.flow', d.map(map)))

  function map(d) {
    return item(data, d)
  }
}
