var header = require('../molecule/header.js')
var footer = require('../molecule/footer.js')

module.exports = section

function section() {
  return transform

  function transform(tree) {
    tree.children.unshift(header())
    tree.children.push(footer())
  }
}
