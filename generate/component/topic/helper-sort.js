'use strict'

var sort = require('../../util/sort.js')

module.exports = sorter

// Sort topics by occurrence.
function sorter(data, names) {
  var {projectsByTopic} = data

  return sort(names, score)

  function score(d) {
    return (projectsByTopic[d] || []).length
  }
}
