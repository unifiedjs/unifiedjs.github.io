'use strict'

var h = require('hastscript')
var icon = require('../icon/oc')

module.exports = oc

function oc(name) {
  var node = icon()

  if (name) {
    node = h('a', {href: 'https://opencollective.com/' + name}, node)
  }

  return h('li', node)
}
