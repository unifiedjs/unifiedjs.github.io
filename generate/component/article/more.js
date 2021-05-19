'use strict'

var card = require('../../atom/card/more.js')
var compact = require('../../util/fmt-compact.js')
var plural = require('../../util/fmt-plural.js')

module.exports = more

function more(section, rest) {
  return card(section.pathname, [
    'See ',
    compact(rest),
    ' other ',
    plural(rest, {one: 'article', other: 'articles'})
  ])
}
