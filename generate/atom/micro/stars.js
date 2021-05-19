'use strict'

var h = require('hastscript')
var fmt = require('../../util/fmt-compact.js')
var icon = require('../icon/stars.js')

module.exports = stars

function stars(value, name) {
  var node = [icon(), ' ', fmt(value)]

  if (name) {
    node = h(
      'a.tap-target',
      {href: 'https://github.com/' + name + '/stargazers'},
      node
    )
  }

  return h('li', node)
}
