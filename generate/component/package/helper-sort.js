'use strict'

var sort = require('../../util/sort')

module.exports = sorter

// Sort packages by score.
function sorter(data, names) {
  var {packageByName} = data

  return sort(names, score)

  function score(d) {
    return packageByName[d].score || 0
  }
}
