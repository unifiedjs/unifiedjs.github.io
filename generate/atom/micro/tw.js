'use strict'

var h = require('hastscript')
var icon = require('../icon/tw.js')

module.exports = twitter

function twitter(name) {
  var node = icon()

  if (name) {
    node = h('a.tap-target', {href: 'https://twitter.com/' + name}, node)
  }

  return h('li', node)
}
