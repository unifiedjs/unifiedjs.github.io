'use strict'

var h = require('hastscript')
var score = require('../../atom/micro/score')
var verified = require('../../atom/micro/verified')
var downloads = require('../../atom/micro/downloads')
var gzip = require('../../atom/micro/gzip')
var box = require('../../atom/box/item')

module.exports = item

function item(data, name) {
  var {packageByName} = data
  var d = packageByName[name]
  var value = d.descriptionRich ? d.descriptionRich.children : d.description

  return box(
    '/explore/package/' + name + '/',
    h('.column', [
      h('h4', name),
      h('.content.double-ellipsis', value),
      h('ol.row', [
        score(d.score),
        verified(d.repo),
        downloads(d.downloads),
        gzip(d.gzip)
      ])
    ])
  )
}
