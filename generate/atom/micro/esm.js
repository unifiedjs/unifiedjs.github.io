'use strict'

var h = require('hastscript')

module.exports = esm

function esm(value, name) {
  var node = value ? 'ESM' : 'CJS'

  if (name) {
    node = h('a', {href: 'https://bundlephobia.com/result?p=' + name}, node)
  }

  return typeof value === 'boolean' ? h('li', node) : ''
}
