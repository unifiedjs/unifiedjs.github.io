'use strict'

var cards = require('../../atom/card/list')
var item = require('./item')
var more = require('./more')

module.exports = list

function list(section, d, options) {
  return cards(d, item, {more: map, ...options})
  function map(rest) {
    return more(section, rest)
  }
}
