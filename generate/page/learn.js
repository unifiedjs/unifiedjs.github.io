/**
 * @import {ElementContent, Root} from 'hast'
 * @import {Metadata} from '../component/article/list.js'
 */

import {ok as assert} from 'devlop'
import {h} from 'hastscript'
import {helperSort} from '../component/article/helper-sort.js'
import {list} from '../component/article/list.js'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {page} from './page.js'

/**
 * @param {ReadonlyArray<Metadata>} sections
 * @returns {Root}
 */
export function learn(sections) {
  /** @type {Array<ElementContent>} */
  const articles = []

  for (const d of sections) {
    assert(d.entries)
    articles.push(
      h('.article.content', [h('h3', {}, d.title), h('p', {}, d.description)]),
      list(d, helperSort(d.entries || []))
    )
  }

  return page(h('.row-l.column-l', {}, h('h2', {}, breadcrumbs('/learn/'))), [
    h('.article.content', [
      h('h3', 'Intro'),
      h('p', [
        'unified is an interface for parsing, inspecting, transforming, and ',
        'serializing content through syntax trees. ',
        h('em', 'And'),
        ' it’s hundreds of building blocks for working on those trees.'
      ]),
      h('p', [
        'This section of our website includes several articles ranging from ',
        'recipes that complete small, specific tasks, to guides that walk ',
        'through how to complete bigger tasks.'
      ])
    ]),
    ...articles,
    h('.article.content', [
      h('h3', 'Explore'),
      h('p', [
        'The readmes of our projects and packages, available through the ',
        h('a', {href: '/explore/'}, 'Explore'),
        ' section of our website (or on GitHub and npm), describe the APIs ',
        'and more in detail.'
      ])
    ])
  ])
}
