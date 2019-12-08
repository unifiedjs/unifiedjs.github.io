'use strict'

var cards = require('../../atom/card/list')
var sort = require('./helper-sort')
var item = require('./item')
var more = require('./more')

module.exports = list

function list(data, d, options) {
  return cards(sort(data, d), map, {more, ...options})
  function map(d) {
    return item(data, d)
  }
}
