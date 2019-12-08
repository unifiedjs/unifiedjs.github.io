'use strict'

var h = require('hastscript')
var fmt = require('../../util/fmt-compact')
var icon = require('../icon/downloads')

module.exports = downloads

function downloads(value, name) {
  var node = [icon(), ' ', fmt(value)]

  if (name) {
    node = h('a.tap-target', {href: 'https://www.npmtrends.com/' + name}, node)
  }

  return h('li', node)
}
