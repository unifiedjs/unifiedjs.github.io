'use strict'

module.exports = reduce

function reduce(data, repo) {
  var {packagesByRepo, packageByName} = data

  return packagesByRepo[repo].some(d => packageByName[d].esm)
}
