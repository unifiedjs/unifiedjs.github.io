'use strict'

var h = require('hastscript')
var compact = require('../../util/fmt-compact.js')
var plural = require('../../util/fmt-plural.js')
var box = require('../../atom/box/more.js')
var sort = require('../package/helper-sort.js')
var list = require('../package/list.js')

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
