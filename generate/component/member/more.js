'use strict'

var compact = require('../../util/fmt-compact.js')
var plural = require('../../util/fmt-plural.js')
var card = require('../../atom/card/more.js')

module.exports = more

function more(rest) {
  return card('/community/member/', [
    'See ',
    compact(rest),
    ' other ',
    plural(rest, {one: 'member', other: 'members'})
  ])
}
