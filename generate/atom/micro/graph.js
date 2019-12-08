'use strict'

var h = require('hastscript')
var fmt = require('../../util/fmt-compact')

module.exports = graph

function graph(dependencies, dependents, name) {
  var uses = [h('span.label', 'Dependencies: '), fmt(dependencies || 0)]
  var by = [h('span.label', 'Dependents: '), fmt(dependents || 0)]

  if (name) {
    uses = h('a', {href: 'https://www.npmjs.com/package/' + name}, uses)
    by = h('a', {href: 'https://www.npmjs.com/browse/depended/' + name}, by)
  }

  return h('li', [].concat(uses, h('span.lowlight.separator', '·'), by))
}
