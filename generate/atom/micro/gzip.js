'use strict'

var h = require('hastscript')
var fmt = require('../../util/fmt-bytes')

module.exports = gzip

function gzip(value, name) {
  var node = fmt(value)

  if (name) {
    node = h('a', {href: 'https://bundlephobia.com/result?p=' + name}, node)
  }

  return value ? h('li', node) : ''
}
