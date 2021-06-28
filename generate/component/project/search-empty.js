import {h} from 'hastscript'

export function searchEmpty(data, query) {
  return h('p.content', [
    'We couldn’t find any projects matching “',
    query,
    '”. ',
    h('a', {href: '/explore/project/'}, 'Browse projects'),
    ' instead.'
  ])
}
