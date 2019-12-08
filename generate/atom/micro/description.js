'use strict'

var h = require('hastscript')

module.exports = description

function description(value, rich) {
  var val = rich ? rich.children : value
  return h('li.ellipsis.content', val)
}
