import h from 'hastscript'
import {tw} from '../atom/icon/tw.js'
import {gh} from '../atom/icon/gh.js'

export function header() {
  return [
    h('.blm', [
      h('.container', [
        h('.row', [
          h('p', [
            h('a', {href: 'https://bailfunds.github.io'}, '#'),
            h('a', {href: 'https://www.gofundme.com/f/georgefloyd'}, 'Black'),
            h(
              'a',
              {href: 'https://www.gofundme.com/f/i-run-with-maud'},
              'Lives'
            ),
            h(
              'a',
              {href: 'https://www.gofundme.com/f/justice-for-mike-ramos'},
              'Matter'
            )
          ])
        ])
      ])
    ]),
    h('header.container', [
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
  ]
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
