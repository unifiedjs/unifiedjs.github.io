var h = require('hastscript')
var findAndReplace = require('hast-util-find-and-replace')
var singular = require('pluralize').singular

module.exports = link

var re = /\b([A-Z]\.?[A-Z][\w.]*)\b/g

var ignore = findAndReplace.ignore.concat(['pre', 'code'])

var titles = {
  AST: 'Abstract Syntax Tree',
  API: null,
  CLI: 'Command-line Interface',
  CST: 'Concrete Syntax Tree',
  DOM: null,
  HSL: 'Hue Saturation Lightness',
  HTML: null,
  IE: 'Internet Explorer',
  ES2016: 'ECMAScript2016',
  ES2015: 'ECMAScript2015'
}

function link() {
  return transform

  function transform(tree, file) {
    var cache = []

    findAndReplace(tree, re, replace, {ignore: ignore})

    function replace($0) {
      var id = singular($0)
      var first = cache.indexOf(id) === -1
      var title = titles[id]
      var props

      if (title === null) {
        return $0
      }

      if (!title) {
        file.fail('Missing abbreviation title for `' + id + '`')
      }

      if (first) {
        cache.push(id)
      }

      props = {title: title}

      if (first) {
        props.className = ['first']
      }

      return h('abbr', props, $0)
    }
  }
}
