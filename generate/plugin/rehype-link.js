/**
 * @import {Root} from 'hast'
 * @import {FindAndReplaceTuple} from 'hast-util-find-and-replace'
 */

import {h} from 'hastscript'
import {findAndReplace, defaultIgnore} from 'hast-util-find-and-replace'

const replacements = initialise()

const ignore = defaultIgnore.concat([
  'a',
  'pre',
  'code',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6'
])

/**
 * @returns
 *   Transform.
 */
export default function rehypeLink() {
  return transform

  /**
   * @param {Root} tree
   * @returns {undefined}
   */
  function transform(tree) {
    findAndReplace(tree, replacements, {ignore})
  }
}

/**
 * @returns {Array<FindAndReplaceTuple>}
 */
function initialise() {
  /** @type {Array<FindAndReplaceTuple>} */
  const result = []
  /** @type {Record<string, string>} */
  const dictionary = {
    'v|file': 'vfile/vfile',
    'uni|fied': 'unifiedjs/unified',
    're|mark': 'remarkjs/remark',
    're|text': 'retextjs/retext',
    're|hype': 'rehypejs/rehype',
    're|dot': 'redotjs/redot',
    'syntax|-tree': 'syntax-tree',
    'uni|st': 'syntax-tree/unist',
    'nl|cst': 'syntax-tree/nlcst',
    'md|ast': 'syntax-tree/mdast',
    'es|ast': 'syntax-tree/esast',
    'h|ast': 'syntax-tree/hast',
    'x|ast': 'syntax-tree/xast',
    'dot|ast': 'redotjs/dotast',
    'MD|X': 'mdx-js/mdx'
  }

  for (const [find, slug] of Object.entries(dictionary)) {
    const parts = find.split('|')
    const name = parts.join('')

    result.push([
      name,
      function () {
        return h(
          'a.' + name.toLowerCase(),
          {href: 'https://github.com/' + slug},
          [h('span.hl', {}, parts[0]), parts[1]]
        )
      }
    ])
  }

  return result
}
