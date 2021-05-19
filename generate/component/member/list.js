'use strict'

var cards = require('../../atom/card/list.js')
var sort = require('./helper-sort.js')
var item = require('./item.js')
var more = require('./more.js')

module.exports = list

function list(data, d, options) {
  return cards(sort(data, d), map, {more, ...options})
  function map(d) {
    return item(data, d)
  }
}
