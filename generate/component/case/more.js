'use strict'

var card = require('../../atom/card/more')
var compact = require('../../util/fmt-compact')
var plural = require('../../util/fmt-plural')

module.exports = more

function more(rest) {
  return card('/community/case/', [
    'See ',
    compact(rest),
    ' other ',
    plural(rest, {one: 'case', other: 'cases'})
  ])
}
