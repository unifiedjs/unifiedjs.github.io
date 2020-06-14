'use strict'

var h = require('hastscript')
var card = require('../../atom/card/item')
var tag = require('../../atom/micro/tag')

module.exports = item

var base = 'https://twitter.com/'

function item(d) {
  var {matter, meta} = d.data
  var data = {...matter, ...meta}
  var {title, description, author, authorTwitter, tags, pathname} = data

  author = h('span.ellipsis', author)

  if (authorTwitter) {
    author = h('a.row', {href: base + authorTwitter}, [
      h('.thumbnail', {
        role: 'presentation',
        style:
          'background-image:url(https://twitter-avatar.now.sh/' +
          authorTwitter +
          ')'
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
