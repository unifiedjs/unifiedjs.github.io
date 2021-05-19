'use strict'

var compact = require('../../util/fmt-compact.js')
var plural = require('../../util/fmt-plural.js')
var box = require('../../atom/box/more.js')

module.exports = more

function more(rest) {
  return box('/explore/project/', [
    'See ',
    compact(rest),
    ' other ',
    plural(rest, {one: 'project', other: 'projects'})
  ])
}
