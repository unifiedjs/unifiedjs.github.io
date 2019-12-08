'use strict'

module.exports = list

function list(names, map, options) {
  var {max, more, trail} = options || {}
  var values = names
  var total = values.length
  var children

  if (max && total >= max) {
    trail = more(total - (max - 1), total)
    values = names.slice(0, max - 1)
  }

  children = values.map(map)

  if (trail) {
    children.push(trail)
  }

  return children
}
