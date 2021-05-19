'use strict'

var sort = require('../../util/sort.js')

module.exports = sorter

// Sort releases by published.
function sorter(data, releases) {
  return sort(releases, score)

  function score(d) {
    return new Date(d.published)
  }
}
