'use strict'

var h = require('hastscript')
var breadcrumbs = require('../molecule/breadcrumbs')
var list = require('../component/release/list')
var filter = require('../component/release/helper-filter')
var sort = require('../component/release/helper-sort')
var page = require('./page')

module.exports = releases

function releases(data) {
  return page(
    h('.row-l.column-l', h('h2', breadcrumbs('/explore/release/'))),
    list(data, filter(data, sort(data, data.releases)))
  )
}
