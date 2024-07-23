/**
 * @import {ElementContent, Element} from 'hast'
 */

import {h} from 'hastscript'
import {tw} from '../atom/icon/tw.js'
import {gh} from '../atom/icon/gh.js'

/**
 * @returns {ElementContent}
 */
export function header() {
  const twitter = tw()
  const github = gh()
  enlarge(twitter)
  enlarge(github)

  return h('header.container', [
    h('.row-l', [
      h('h1', {}, h('a.unified', {href: '/'}, [h('span.hl', 'uni'), 'fied'])),
      h('nav.row-l.flex', {ariaLabel: 'Main navigation'}, [
        h('ol.row.flex', [
          h('li', {}, h('a', {href: '/explore/'}, 'Explore')),
          h('li', {}, h('a', {href: '/learn/'}, 'Learn')),
          h('li', {}, h('a', {href: '/community/'}, 'Community'))
        ]),
        h('ol.row.x-show-l.justify-end-l', [
          h('li', [
            h('a', {href: 'https://twitter.com/unifiedjs'}, [
              twitter,
              h('span.x-hide-l', 'Twitter')
            ])
          ]),
          h('li', [
            h('a', {href: 'https://github.com/unifiedjs'}, [
              github,
              h('span.x-hide-l', 'GitHub')
            ])
          ])
        ])
      ])
    ])
  ])
}

/**
 * @param {Element} node
 * @returns {undefined}
 */
function enlarge(node) {
  Object.assign(node.properties, {
    role: 'img',
    width: 24,
    height: 24,
    className: ['icon', 'x-show-l']
  })
}
