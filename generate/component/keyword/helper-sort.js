'use strict'

var sort = require('../../util/sort')

module.exports = sorter

// Sort keywords by occurrence.
function sorter(data, names) {
  var {packagesByKeyword} = data

  return sort(names, score)

  function score(d) {
    return (packagesByKeyword[d] || []).length
  }
}
