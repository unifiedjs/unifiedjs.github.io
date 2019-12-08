'use strict'

var h = require('hastscript')
var breadcrumbs = require('../molecule/breadcrumbs')
var list = require('../component/package/list')
var sort = require('../component/package/helper-sort')
var page = require('./page')

module.exports = packages

function packages(data) {
  return page(h('.row-l.column-l', h('h2', breadcrumbs('/explore/package'))), [
    h('.content', h('h3', 'All packages')),
    list(data, sort(data, Object.keys(data.packageByName)))
  ])
}
