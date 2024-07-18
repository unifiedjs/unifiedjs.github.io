import {h} from 'hastscript'

export function footer() {
  return h('footer.container', [
    h('nav.row-l.flex', [
      h('ol.row.flex.x-show-l', [
        h('li', {}, h('a.unified', {href: '/'}, [h('span.hl', 'uni'), 'fied'])),
        h('li', {}, h('a', {href: '/explore/'}, 'Explore')),
        h('li', {}, h('a', {href: '/learn/'}, 'Learn')),
        h('li', {}, h('a', {href: '/community/'}, 'Community'))
      ]),
      h('ol.row.justify-end-l', [
        h(
          'li',
          h('a', {href: 'https://opencollective.com/unified'}, 'OpenCollective')
        ),
        h('li', {}, h('a', {href: 'https://twitter.com/unifiedjs'}, 'Twitter')),
        h('li', {}, h('a', {href: 'https://github.com/unifiedjs'}, 'GitHub'))
      ])
    ])
  ])
}
