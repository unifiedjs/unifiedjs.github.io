'use strict'

var h = require('hastscript')
var compact = require('../../util/fmt-compact.js')
var plural = require('../../util/fmt-plural.js')
var box = require('../../atom/box/more.js')
var list = require('../project/list.js')
var sort = require('../project/helper-sort.js')

module.exports = item

function item(data, d) {
  var {projectsByTopic} = data

  return [
    h('.content', h('h3', d)),
    list(data, sort(data, projectsByTopic[d]), {max: 3, more})
  ]

  function more(rest) {
    return box('/explore/topic/' + d + '/', [
      'Explore ',
      compact(rest),
      ' other ',
      plural(rest, {one: 'project', other: 'projects'}),
      ' matching ',
      h('span.tag', d)
    ])
  }
}
