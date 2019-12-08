'use strict'

var h = require('hastscript')
var breadcrumbs = require('../molecule/breadcrumbs')
var list = require('../component/topic/list')
var filter = require('../component/topic/helper-filter')
var sort = require('../component/topic/helper-sort')
var page = require('./page')

module.exports = keywords

function keywords(data) {
  return page(
    h('.row-l.column-l', h('h2', breadcrumbs('/explore/topic/'))),
    list(data, filter(data, sort(data, Object.keys(data.projectsByTopic)), 2))
  )
}
