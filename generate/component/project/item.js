'use strict'

var h = require('hastscript')
var downloads = require('../../atom/micro/downloads.js')
var score = require('../../atom/micro/score.js')
var stars = require('../../atom/micro/stars.js')
var verified = require('../../atom/micro/verified.js')
var box = require('../../atom/box/item.js')
var reduceDownloads = require('./helper-reduce-downloads.js')
var reduceScore = require('./helper-reduce-score.js')

module.exports = item

function item(data, name) {
  var {projectByRepo, packagesByRepo} = data
  var d = projectByRepo[name]
  var names = packagesByRepo[name]

  var href =
    '/explore/' +
    (names.length > 1 ? 'project/' + name : 'package/' + names[0]) +
    '/'

  var value = d.descriptionRich ? d.descriptionRich.children : d.description

  return box(
    href,
    h('.column', [
      h('h4', name),
      h('.content.double-ellipsis', value),
      h('ol.row', [
        score(reduceScore(data, name)),
        verified(name),
        downloads(reduceDownloads(data, name)),
        stars(d.stars)
      ])
    ])
  )
}
