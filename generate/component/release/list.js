'use strict'

var h = require('hastscript')
var list = require('../../atom/macro/list.js')
var item = require('./item.js')
var more = require('./more.js')

module.exports = releases

function releases(data, releases, options) {
  return h('ol.releases', list(releases, map, {more, ...options}))

  function map(d) {
    return item(data, d)
  }
}
