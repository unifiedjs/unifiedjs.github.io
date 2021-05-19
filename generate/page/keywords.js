'use strict'

var h = require('hastscript')
var breadcrumbs = require('../molecule/breadcrumbs.js')
var list = require('../component/keyword/list.js')
var filter = require('../component/keyword/helper-filter.js')
var sort = require('../component/keyword/helper-sort.js')
var page = require('./page.js')

module.exports = keywords

function keywords(data) {
  return page(
    h('.row-l.column-l', h('h2', breadcrumbs('/explore/keyword/'))),
    list(data, filter(data, sort(data, Object.keys(data.packagesByKeyword)), 2))
  )
}
