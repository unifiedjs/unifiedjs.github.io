import {h} from 'hastscript'
import {findAndReplace, defaultIgnore} from 'hast-util-find-and-replace'

var replacements = initialise()

var ignore = defaultIgnore.concat([
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

export default function rehypeLink() {
  return transform

  function transform(tree) {
    findAndReplace(tree, replacements, {ignore: ignore})
  }
}

function initialise() {
  var result = {}
  var dictionary = {
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

  Object.keys(dictionary).forEach(add)

  return result

  function add(find) {
    var parts = find.split('|')
    var name = parts.join('')
    var slug = dictionary[find]

    result[name] = replacer

    function replacer() {
      return h(
        'a.' + name.toLowerCase(),
        {href: 'https://github.com/' + slug},
        [h('span.hl', parts[0]), parts[1]]
      )
    }
  }
}
