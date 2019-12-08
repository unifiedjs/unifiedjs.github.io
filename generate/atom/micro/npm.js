'use strict'

var h = require('hastscript')
var icon = require('../icon/npm')

module.exports = npm

var base = 'https://www.npmjs.com/'

function npm(name) {
  var node = icon()
  var href

  if (name) {
    href = base + (name.charAt(0) === '~' ? '' : 'package/') + name
    node = h('a.tap-target', {href}, node)
  }

  return h('li', node)
}
