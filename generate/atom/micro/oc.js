'use strict'

var h = require('hastscript')
var icon = require('../icon/oc.js')

module.exports = oc

function oc(name) {
  var node = icon()

  if (name) {
    node = h('a.tap-target', {href: 'https://opencollective.com/' + name}, node)
  }

  return h('li', node)
}
