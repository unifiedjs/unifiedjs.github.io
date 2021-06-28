import {h} from 'hastscript'
import {item as card} from '../../atom/card/item.js'
import {tag} from '../../atom/micro/tag.js'

export function item(d) {
  const {matter, meta} = d.data
  const data = {...matter, ...meta}
  let {title, description, author, authorGithub, tags, pathname} = data

  author = h('span.ellipsis', author)

  if (authorGithub) {
    author = h('a.row', {href: 'https://github.com/' + authorGithub}, [
      h('.thumbnail', {
        role: 'presentation',
        style:
          'background-image:url(https://github.com/' +
          authorGithub +
          '.png?size=64)'
      }),
      author
    ])
  }

  return card(
    pathname,
    h('.column', [
      h('h3.ellipsis', title),
      h('p.double-ellipsis', description || ''),
      h(
        'ol.row.ellipsis',
        (tags || []).map((d) => tag(d))
      )
    ]),
    h('li.row', author)
  )
}
