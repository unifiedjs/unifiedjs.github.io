'use strict'

var compact = require('../../util/fmt-compact')
var plural = require('../../util/fmt-plural')
var card = require('../../atom/card/more')

module.exports = more

function more(rest) {
  return card('/community/member/', [
    'See ',
    compact(rest),
    ' other ',
    plural(rest, {one: 'member', other: 'members'})
  ])
}
