'use strict'

var h = require('hastscript')
var fmt = require('../../util/fmt-compact.js')

module.exports = tag

function tag(label, count, href) {
  var nodes = [label]

  if (count) {
    nodes.push(' ', h('span.count', fmt(count)))
  }

  return h(
    'li.inline-block',
    href ? h('a.tag', {href}, nodes) : h('span.tag', nodes)
  )
}
