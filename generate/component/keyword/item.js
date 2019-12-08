'use strict'

var h = require('hastscript')
var compact = require('../../util/fmt-compact')
var plural = require('../../util/fmt-plural')
var box = require('../../atom/box/more')
var sort = require('../package/helper-sort')
var list = require('../package/list')

module.exports = item

function item(data, d) {
  var {packagesByKeyword} = data

  return [
    h('.content', h('h3', d)),
    list(data, sort(data, packagesByKeyword[d]), {max: 3, more})
  ]

  function more(rest) {
    return box('/explore/keyword/' + d + '/', [
      'Explore ',
      compact(rest),
      ' other ',
      plural(rest, {one: 'package', other: 'packages'}),
      ' matching ',
      h('span.tag', d)
    ])
  }
}
