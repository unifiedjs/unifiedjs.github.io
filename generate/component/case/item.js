/**
 * @import {Element, ElementContent} from 'hast'
 */

/**
 * @typedef Metadata
 * @property {string | undefined} gh
 * @property {string} short
 * @property {string} src
 * @property {string} title
 * @property {string} url
 */

import assert from 'node:assert/strict'
import {h} from 'hastscript'
import {gh as ghBadge} from '../../atom/micro/gh.js'
import {url as urlLine} from '../../atom/micro/url.js'
import {item as card} from '../../atom/card/item.js'

/**
 *
 * @param {Metadata} d
 * @returns {Element}
 */
export function item(d) {
  const {title, short, url, gh, src} = d
  /** @type {Array<ElementContent>} */
  const footer = []

  if (gh) {
    footer.push(ghBadge(gh))
  }

  assert(url)
  footer.push(urlLine(url))

  return card(
    url,
    [
      h('.screen', {}, h('img', {src, alt: ''})),
      h('.column', [
        h('h3.row', [h('span.ellipsis', {}, title)]),
        h('p.double-ellipsis', {}, short)
      ])
    ],
    footer
  )
}
