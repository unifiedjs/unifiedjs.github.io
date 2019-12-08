'use strict'

var h = require('hastscript')
var icon = require('../icon/gh')

module.exports = github

function github(name) {
  var node = icon()

  if (name) {
    node = h('a.tap-target', {href: 'https://github.com/' + name}, node)
  }

  return h('li', node)
}
