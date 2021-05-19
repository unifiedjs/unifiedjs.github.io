'use strict'

var h = require('hastscript')
var ghBadge = require('../../atom/micro/gh.js')
var urlLine = require('../../atom/micro/url.js')
var card = require('../../atom/card/item.js')

module.exports = item

function item(d) {
  var {title, short, url, gh, src} = d
  var footer = []

  if (gh) {
    footer.push(ghBadge(gh))
  }

  if (url) {
    footer.push(urlLine(url))
  }

  return card(
    url,
    [
      h('.screen', h('img', {src, alt: ''})),
      h('.column', [
        h('h3.row', [h('span.ellipsis', title)]),
        h('p.double-ellipsis', short)
      ])
    ],
    footer
  )
}
