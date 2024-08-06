/**
 * @import {Root} from 'hast'
 * @import {FindAndReplaceTuple} from 'hast-util-find-and-replace'
 */

import {h} from 'hastscript'
import {defaultIgnore, findAndReplace} from 'hast-util-find-and-replace'

const replacements = initialise()

const ignore = [
  ...defaultIgnore,
  'a',
  'code',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'pre'
]

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
    'MD|X': 'mdx-js/mdx',
    'dot|ast': 'redotjs/dotast',
    'es|ast': 'syntax-tree/esast',
    'h|ast': 'syntax-tree/hast',
    'md|ast': 'syntax-tree/mdast',
    'micro|mark': 'micromark/micromark',
    'nl|cst': 'syntax-tree/nlcst',
    're|dot': 'redotjs/redot',
    're|hype': 'rehypejs/rehype',
    're|mark': 'remarkjs/remark',
    're|text': 'retextjs/retext',
    'syntax|-tree': 'syntax-tree',
    'uni|fied': 'unifiedjs/unified',
    'uni|st': 'syntax-tree/unist',
    'v|file': 'vfile/vfile',
    'x|ast': 'syntax-tree/xast'
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
