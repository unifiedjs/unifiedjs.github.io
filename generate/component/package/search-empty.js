import h from 'hastscript'

export function searchEmpty(data, query) {
  return h('p.content', [
    'We couldn’t find any packages matching “',
    query,
    '”. ',
    h('a', {href: '/explore/package/'}, 'Browse packages'),
    ' instead.'
  ])
}
