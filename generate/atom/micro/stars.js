'use strict'

var h = require('hastscript')
var fmt = require('../../util/fmt-compact')
var icon = require('../icon/stars')

module.exports = stars

function stars(value, name) {
  var node = [icon(), ' ', fmt(value)]

  if (name) {
    node = h('a', {href: 'https://github.com/' + name + '/stargazers'}, node)
  }

  return h('li', node)
}
