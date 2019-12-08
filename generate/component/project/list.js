'use strict'

var boxes = require('../../atom/box/list')
var item = require('./item')
var more = require('./more')

module.exports = list

function list(data, names, options) {
  return boxes(names, map, {more, ...options})

  function map(d) {
    return item(data, d)
  }
}
