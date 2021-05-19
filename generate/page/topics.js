'use strict'

var h = require('hastscript')
var breadcrumbs = require('../molecule/breadcrumbs.js')
var list = require('../component/topic/list.js')
var filter = require('../component/topic/helper-filter.js')
var sort = require('../component/topic/helper-sort.js')
var page = require('./page.js')

module.exports = keywords

function keywords(data) {
  return page(
    h('.row-l.column-l', h('h2', breadcrumbs('/explore/topic/'))),
    list(data, filter(data, sort(data, Object.keys(data.projectsByTopic)), 2))
  )
}
