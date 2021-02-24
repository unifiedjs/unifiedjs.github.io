'use strict'

var sort = require('../../util/sort').asc

module.exports = sorter

// Sort articles by index.
function sorter(data) {
  return sort(data, score)
}

function score(d) {
  return (d.data.matter || {}).index || Number.POSITIVE_INFINITY
}
