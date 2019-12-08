'use strict'

var card = require('../../atom/card/more')
var compact = require('../../util/fmt-compact')
var plural = require('../../util/fmt-plural')

module.exports = more

function more(section, rest) {
  return card(section.pathname, [
    'See ',
    compact(rest),
    ' other ',
    plural(rest, {one: 'article', other: 'articles'})
  ])
}
