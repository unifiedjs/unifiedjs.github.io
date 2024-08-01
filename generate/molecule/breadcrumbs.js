/**
 * @import {ElementContent} from 'hast'
 */

import {h} from 'hastscript'

const slash = '/'

/** @type {Record<string, [plural: string, singular: string] | string>} */
const overwrites = {
  case: 'Cases',
  community: 'Community',
  explore: 'Explore',
  keyword: ['Keywords', 'Keyword'],
  guide: ['Guides', 'Guide'],
  learn: 'Learn',
  member: 'Members',
  package: ['Packages', 'Package'],
  project: ['Projects', 'Project'],
  recipe: ['Recipes', 'Recipe'],
  release: 'Releases',
  sponsor: 'Sponsors',
  topic: ['Topics', 'Topic']
}

/**
 * @param {string} filepath
 * @param {string | null | undefined} [title]
 * @returns {Array<ElementContent | string | undefined>}
 */
export function breadcrumbs(filepath, title) {
  const parts = filepath.split(slash).filter(Boolean)
  let index = -1
  /** @type {Array<ElementContent>} */
  const results = []

  while (++index < parts.length) {
    const part = parts[index]
    const last = parts.length - 1 === index
    const components = parts.slice(0, index + 1)
    const href = slash + components.join(slash) + slash
    let node = h('a', {href}, word(last && title ? title : part, last))

    if (last) {
      node.properties.rel = ['canonical']
      node = h('span.content', {}, node)
    }

    results.push(node)

    if (!last) {
      results.push(h('span.lowlight.separator', '/'))
    }
  }

  return results
}

/**
 * @param {string} d
 * @param {boolean} last
 * @returns {string}
 */
function word(d, last) {
  const value = d in overwrites ? overwrites[d] : d
  return typeof value === 'string' ? value : value[last ? 0 : 1]
}
