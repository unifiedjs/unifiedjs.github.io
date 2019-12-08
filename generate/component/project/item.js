'use strict'

var h = require('hastscript')
var downloads = require('../../atom/micro/downloads')
var score = require('../../atom/micro/score')
var stars = require('../../atom/micro/stars')
var verified = require('../../atom/micro/verified')
var box = require('../../atom/box/item')
var reduceDownloads = require('./helper-reduce-downloads')
var reduceScore = require('./helper-reduce-score')

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
