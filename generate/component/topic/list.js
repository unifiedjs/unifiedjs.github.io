'use strict'

var list = require('../../atom/macro/list.js')
var item = require('./item.js')

module.exports = topics

function topics(data, d, options) {
  return list(d, map, options)
  function map(d) {
    return item(data, d)
  }
}
