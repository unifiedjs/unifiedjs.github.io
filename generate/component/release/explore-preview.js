'use strict'

var more = require('../../atom/box/more')
var list = require('./list')
var filter = require('./helper-filter')
var sort = require('./helper-sort')

module.exports = preview

function preview(data) {
  return list(data, filter(data, sort(data, data.releases)).slice(0, 3), {
    trail: more('/explore/release/', 'Explore recent releases')
  })
}
