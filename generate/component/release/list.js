'use strict'

var h = require('hastscript')
var list = require('../../atom/macro/list')
var item = require('./item')
var more = require('./more')

module.exports = releases

function releases(data, releases, options) {
  return h('ol.releases', list(releases, map, {more, ...options}))

  function map(d) {
    return item(data, d)
  }
}
