import h from 'hastscript'

export function searchPreview() {
  return h('p.content', [
    'Explore the projects in the ecosystem by ',
    h('a', {href: '/explore/topic/'}, 'topic'),
    '.'
  ])
}
