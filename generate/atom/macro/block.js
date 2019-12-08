'use strict'

var h = require('hastscript')

module.exports = block

function block(main, footer) {
  return h(
    'li',
    {className: footer ? ['nl-root'] : []},
    [].concat(main, footer ? h('.nl-foot', footer) : [])
  )
}
