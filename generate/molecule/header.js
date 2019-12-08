'use strict'

var h = require('hastscript')
var st = require('../atom/icon/st')
var oc = require('../atom/icon/oc')
var tw = require('../atom/icon/tw')
var gh = require('../atom/icon/gh')

module.exports = header

function header() {
  return h('header.container', [
    h('.row-l', [
      h('h1', h('a.unified', {href: '/'}, [h('span.hl', 'uni'), 'fied'])),
      h('nav.row-l.flex', {ariaLabel: 'Main navigation'}, [
        h('ol.row.flex', [
          h('li', h('a', {href: '/explore/'}, 'Explore')),
          h('li', h('a', {href: '/learn/'}, 'Learn')),
          h('li', h('a', {href: '/community/'}, 'Community'))
        ]),
        h('ol.row.x-show-l.justify-end-l', [
          h('li', [
            h('a', {href: 'https://spectrum.chat/unified'}, [
              enlarge(st()),
              h('span.x-hide-l', 'Spectrum')
            ])
          ]),
          h('li', [
            h('a', {href: 'https://opencollective.com/unified'}, [
              enlarge(oc()),
              h('span.x-hide-l', 'OpenCollective')
            ])
          ]),
          h('li', [
            h('a', {href: 'https://twitter.com/unifiedjs'}, [
              enlarge(tw()),
              h('span.x-hide-l', 'Twitter')
            ])
          ]),
          h('li', [
            h('a', {href: 'https://github.com/unifiedjs'}, [
              enlarge(gh()),
              h('span.x-hide-l', 'GitHub')
            ])
          ])
        ])
      ])
    ])
  ])
}

function enlarge(node) {
  Object.assign(node.properties, {
    role: 'img',
    width: 24,
    height: 24,
    className: ['icon', 'x-show-l']
  })
  return node
}
