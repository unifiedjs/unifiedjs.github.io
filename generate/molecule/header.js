/**
 * @import {ElementContent, Element} from 'hast'
 */

import {h} from 'hastscript'
import {gh} from '../atom/icon/gh.js'

/**
 * @returns {ElementContent}
 */
export function header() {
  const github = gh()

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
  node.properties.className = ['icon', 'x-show-l']
  node.properties.height = 24
  node.properties.role = 'img'
  node.properties.width = 24
}
