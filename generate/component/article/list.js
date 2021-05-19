'use strict'

var cards = require('../../atom/card/list.js')
var item = require('./item.js')
var more = require('./more.js')

module.exports = list

function list(section, d, options) {
  return cards(d, item, {more: map, ...options})
  function map(rest) {
    return more(section, rest)
  }
}
