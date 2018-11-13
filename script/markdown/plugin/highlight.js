var visit = require('unist-util-visit')
var lowlight = require('lowlight')
var h = require('hastscript')
var select = require('hast-util-select')
var fromString = require('hast-util-from-string')
var toString = require('hast-util-to-string')
var trim = require('trim')

module.exports = highlight

function highlight() {
  return transform

  function transform(tree) {
    visit(tree, 'code', visitor)
  }

  function visitor(node, index, parent) {
    var lang = node.lang
    var name
    var fn

    if (!lang) {
      return
    }

    lang = lang.split(/\s+/)
    name = lang.slice(1).join('')
    lang = lang[0]

    if (!lang || !name) {
      return
    }

    fn = name === 'sh' ? sh : gist

    parent.children[index] = {
      type: 'unknown',
      data: {
        hName: 'figure',
        hProperties: {
          className: ['window', name === 'sh' ? 'terminal' : 'gist']
        },
        hChildren: [h('figcaption', name)].concat(fn(node, lang))
      }
    }
  }

  function gist(node, lang) {
    var nodes = lowlight.highlight(lang, node.value).value

    if (lang === 'diff') {
      removePrefixes(nodes)
    }

    return h('pre', [
      h(
        'code',
        {
          className: ['language-' + lang]
        },
        nodes
      )
    ])
  }

  function sh(node) {
    var lines = node.value.split(/\n/g)
    var nodes = []
    var index = -1
    var length = lines.length
    var queue = []
    var curr
    var type
    var line
    var final

    while (++index < length) {
      line = lines[index]
      type = 'output'

      if (line.charAt(0) === '$') {
        line = line.slice(1)
        type = 'input'
      }

      if (curr && type !== curr) {
        flush()
      }

      queue.push(trim(type === 'input' ? line.slice(1) : line))
      curr = type
    }

    flush()

    function flush() {
      var value
      var node

      if (queue.length === 0) {
        return
      }

      value = queue.join('\n')

      if (nodes.length !== 0) {
        value = '\n' + value
      }

      queue = []
      node = h('span', {className: [curr]}, value)

      if (value.slice(0, 3) === 'npm') {
        node.properties.className.push('delay-output')
      }

      nodes.push(node)
    }

    final = nodes[nodes.length - 1].properties.className[0] === 'output'

    return h(
      'pre',
      {
        className: final ? null : ['no-final-prompt']
      },
      nodes
    )
  }

  function removePrefixes(nodes) {
    nodes.forEach(strip)
  }

  function strip(node) {
    if (select.matches('.hljs-addition, .hljs-deletion', node)) {
      fromString(node, toString(node).slice(1))
    }
  }
}
