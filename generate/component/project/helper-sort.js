'use strict'

var sort = require('../../util/sort.js')
var reduce = require('./helper-reduce-score.js')

module.exports = sorter

// Sort projects by score.
function sorter(data, names) {
  return sort(names, score)

  function score(d) {
    return reduce(data, d)
  }
}
