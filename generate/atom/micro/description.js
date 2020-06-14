'use strict'

var h = require('hastscript')

module.exports = description

function description(value, rich) {
  return h('li.ellipsis.content', rich ? rich.children : value)
}
