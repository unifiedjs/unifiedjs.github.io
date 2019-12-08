'use strict'

module.exports = reduce

function reduce(data, repo) {
  var {packagesByRepo, packageByName} = data

  return packagesByRepo[repo]
    .map(d => packageByName[d].score)
    .reduce((all, d) => (d > all ? d : all), 0)
}
