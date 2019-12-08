'use strict'

var h = require('hastscript')
var breadcrumbs = require('../molecule/breadcrumbs')
var list = require('../component/keyword/list')
var filter = require('../component/keyword/helper-filter')
var sort = require('../component/keyword/helper-sort')
var page = require('./page')

module.exports = keywords

function keywords(data) {
  return page(
    h('.row-l.column-l', h('h2', breadcrumbs('/explore/keyword/'))),
    list(data, filter(data, sort(data, Object.keys(data.packagesByKeyword)), 2))
  )
}
