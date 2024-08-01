/**
 * @import {Element} from 'hast'
 * @import {VFile} from 'vfile'
 */

import assert from 'node:assert/strict'
import {h} from 'hastscript'
import {item as card} from '../../atom/card/item.js'
import {tag} from '../../atom/micro/tag.js'

/**
 * @param {VFile} d
 * @returns {Element}
 */
export function item(d) {
  const {matter, meta} = d.data
  const data = {...matter, ...meta}
  const {authorGithub, author, description, pathname, tags, title} = data

  assert(pathname)

  let authorDisplay = h('span.ellipsis', {}, author)

  if (authorGithub) {
    authorDisplay = h('a.row', {href: 'https://github.com/' + authorGithub}, [
      h('.thumbnail', {
        role: 'presentation',
        style:
          'background-image:url(https://github.com/' +
          authorGithub +
          '.png?size=64)'
      }),
      authorDisplay
    ])
  }

  /** @type {Array<Element>} */
  const results = []

  if (tags) {
    for (const d of tags) {
      results.push(tag(d))
    }
  }

  return card(
    pathname,
    h('.column', [
      h('h3.ellipsis', {}, title),
      h('p.double-ellipsis', {}, description || ''),
      h('ol.row.ellipsis', {}, results)
    ]),
    h('li.row', {}, authorDisplay)
  )
}
