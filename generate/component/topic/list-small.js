'use strict'

var h = require('hastscript')
var item = require('./item-small')

module.exports = topics

function topics(data, d) {
  return h('.block', h('ol.flow', d.map(map)))

  function map(d) {
    return item(data, d)
  }
}
