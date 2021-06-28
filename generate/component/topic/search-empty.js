import {h} from 'hastscript'

export function searchEmpty(data, query) {
  return h('p.content', [
    'We couldn’t find any topics matching “',
    query,
    '”. ',
    h('a', {href: '/explore/topic/'}, 'Browse topics'),
    ' instead.'
  ])
}
