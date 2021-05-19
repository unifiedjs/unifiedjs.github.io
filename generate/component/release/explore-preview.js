'use strict'

var releases = require('../../../data/releases.json')
var more = require('../../atom/box/more.js')
var list = require('./list.js')
var filter = require('./helper-filter.js')
var sort = require('./helper-sort.js')

module.exports = preview

function preview(data) {
  return list(data, filter(data, sort(data, releases)).slice(0, 3), {
    trail: more('/explore/release/', 'Explore recent releases')
  })
}
