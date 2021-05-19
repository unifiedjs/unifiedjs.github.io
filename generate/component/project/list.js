'use strict'

var boxes = require('../../atom/box/list.js')
var item = require('./item.js')
var more = require('./more.js')

module.exports = list

function list(data, names, options) {
  return boxes(names, map, {more, ...options})

  function map(d) {
    return item(data, d)
  }
}
