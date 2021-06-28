import h from 'hastscript'

export function searchEmpty(data, query) {
  return h('p.content', [
    'We couldn’t find any keywords matching “',
    query,
    '”. ',
    h('a', {href: '/explore/keyword/'}, 'Browse keywords'),
    ' instead.'
  ])
}
