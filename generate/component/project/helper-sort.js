'use strict'

var sort = require('../../util/sort')
var reduce = require('./helper-reduce-score')

module.exports = sorter

// Sort projects by score.
function sorter(data, names) {
  return sort(names, score)

  function score(d) {
    return reduce(data, d)
  }
}
