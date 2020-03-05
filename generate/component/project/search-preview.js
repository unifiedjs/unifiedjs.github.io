'use strict'

var more = require('../../atom/box/more')
var fmt = require('../../util/fmt-compact')
var pick = require('../../util/pick-random')
var list = require('./list')
var sort = require('./helper-sort')

module.exports = preview

function preview(data) {
  var {projectByRepo} = data
  var names = sort(data, Object.keys(projectByRepo))
  var d = pick(names.slice(0, 75), 5)

  var trail = more('/explore/project/', [
    'Explore the ',
    fmt(names.length),
    ' projects in the ecosystem'
  ])

  return list(data, d, {trail})
}
