var header = require('../molecule/header')
var footer = require('../molecule/footer')

module.exports = section

function section() {
  return transform

  function transform(tree) {
    tree.children.unshift(header())
    tree.children.push(footer())
  }
}
