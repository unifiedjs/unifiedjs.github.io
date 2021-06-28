import {h} from 'hastscript'

export function searchPreview() {
  return h('p.content', [
    'Explore the packages in the ecosystem by ',
    h('a', {href: '/explore/keyword/'}, 'keyword'),
    '.'
  ])
}
