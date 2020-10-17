'use strict'

var h = require('hastscript')

module.exports = line

var slash = '/'

var overwrites = {
  learn: 'Learn',
  guide: ['Guides', 'Guide'],
  recipe: ['Recipes', 'Recipe'],
  explore: 'Explore',
  keyword: ['Keywords', 'Keyword'],
  topic: ['Topics', 'Topic'],
  package: ['Packages', 'Package'],
  project: ['Projects', 'Project'],
  community: 'Community',
  sponsor: 'Sponsors',
  case: 'Cases',
  member: 'Members'
}

function line(filepath, title) {
  return filepath.split(slash).filter(Boolean).flatMap(map)

  function map(d, i, data) {
    var last = data.length - 1 === i
    var components = data.slice(0, i + 1)
    var href = slash + components.join(slash) + slash
    var node = h('a', {href}, word(last && title ? title : d, last))

    if (last) {
      node.properties.rel = ['canonical']
      node = h('span.content', node)
    }

    return [node, last ? '' : h('span.lowlight.separator', '/')]
  }
}

function word(d, last) {
  var value = d in overwrites ? overwrites[d] : d
  return typeof value === 'string' ? value : value[last ? 0 : 1]
}
