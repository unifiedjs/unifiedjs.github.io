import {h} from 'hastscript'
import {findAndReplace, defaultIgnore} from 'hast-util-find-and-replace'
import pluralize from 'pluralize'

const re = /\b([A-Z]\.?[A-Z][\w.]*)\b/g

const ignore = defaultIgnore.concat(['pre', 'code'])

export default function rehypeAbbreviate(titles) {
  return transform

  function transform(tree, file) {
    const cache = []

    findAndReplace(tree, [re, replace], {ignore})

    function replace($0) {
      const id = pluralize.singular($0)
      const first = !cache.includes(id)
      const title = titles[id]

      if (title === null) {
        return $0
      }

      if (!title) {
        file.message('Missing abbreviation title for `' + id + '`')
        return $0
      }

      if (first) {
        cache.push(id)
      }

      const props = {title}

      if (first) {
        props.className = ['first']
      }

      return h('abbr', props, $0)
    }
  }
}
