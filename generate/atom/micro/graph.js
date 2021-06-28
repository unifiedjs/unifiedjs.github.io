'use strict'

var h = require('hastscript')
var fmt = require('../../util/fmt-compact.js')

module.exports = graph

function graph(dependents, name) {
  var by = [h('span.label', 'Dependents: '), fmt(dependents || 0)]

  if (name) {
    by = h(
      'a.tap-target',
      {href: 'https://www.npmjs.com/browse/depended/' + name},
      by
    )
  }

  return h('li', by)
}
