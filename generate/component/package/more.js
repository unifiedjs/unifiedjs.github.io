'use strict'

var compact = require('../../util/fmt-compact')
var plural = require('../../util/fmt-plural')
var box = require('../../atom/box/more')

module.exports = more

function more(rest) {
  return box('/explore/package/', [
    'See ',
    compact(rest),
    ' other ',
    plural(rest, {one: 'package', other: 'packages'})
  ])
}
