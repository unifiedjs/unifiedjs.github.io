import {h} from 'hastscript'

const slash = '/'

const overwrites = {
  learn: 'Learn',
  guide: ['Guides', 'Guide'],
  recipe: ['Recipes', 'Recipe'],
  explore: 'Explore',
  keyword: ['Keywords', 'Keyword'],
  topic: ['Topics', 'Topic'],
  package: ['Packages', 'Package'],
  project: ['Projects', 'Project'],
  release: 'Releases',
  community: 'Community',
  sponsor: 'Sponsors',
  case: 'Cases',
  member: 'Members'
}

export function breadcrumbs(filepath, title) {
  return filepath.split(slash).filter(Boolean).flatMap(map)

  function map(d, i, data) {
    const last = data.length - 1 === i
    const components = data.slice(0, i + 1)
    const href = slash + components.join(slash) + slash
    let node = h('a', {href}, word(last && title ? title : d, last))

    if (last) {
      node.properties.rel = ['canonical']
      node = h('span.content', node)
    }

    return [node, last ? '' : h('span.lowlight.separator', '/')]
  }
}

function word(d, last) {
  const value = d in overwrites ? overwrites[d] : d
  return typeof value === 'string' ? value : value[last ? 0 : 1]
}
