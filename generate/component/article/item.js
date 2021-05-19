'use strict'

var h = require('hastscript')
var card = require('../../atom/card/item.js')
var tag = require('../../atom/micro/tag.js')

module.exports = item

var base = 'https://github.com/'

function item(d) {
  var {matter, meta} = d.data
  var data = {...matter, ...meta}
  var {title, description, author, authorGithub, tags, pathname} = data

  author = h('span.ellipsis', author)

  if (authorGithub) {
    author = h('a.row', {href: base + authorGithub}, [
      h('.thumbnail', {
        role: 'presentation',
        style: 'background-image:url(' + base + authorGithub + '.png?size=64)'
      }),
      author
    ])
  }

  return card(
    pathname,
    h('.column', [
      h('h3.ellipsis', title),
      h('p.double-ellipsis', description || ''),
      h(
        'ol.row.ellipsis',
        (tags || []).map((d) => tag(d))
      )
    ]),
    h('li.row', author)
  )
}
