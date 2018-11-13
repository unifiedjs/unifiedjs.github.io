var h = require('hastscript')

module.exports = section

function section() {
  return transform
  function transform(tree) {
    tree.children.unshift(
      h(
        'header',
        h('h1', h('a', {href: '..'}, [h('span.hl.unified', 'uni'), 'fied']))
      )
    )
  }
}
