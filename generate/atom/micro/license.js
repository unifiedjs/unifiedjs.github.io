'use strict'

var spdx = require('spdx-license-list')
var h = require('hastscript')
var icon = require('../icon/license.js')

module.exports = license

function license(value) {
  var url = value in spdx ? spdx[value].url : null
  var node = value ? [icon(), ' ', value] : ''

  if (url) {
    node = h('a.tap-target', {href: url}, node)
  }

  return node ? h('li', node) : ''
}
