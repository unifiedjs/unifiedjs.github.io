'use strict'

var h = require('hastscript')
var breadcrumbs = require('../molecule/breadcrumbs.js')
var list = require('../component/package/list.js')
var sort = require('../component/package/helper-sort.js')
var page = require('./page.js')

module.exports = packages

function packages(data) {
  return page(h('.row-l.column-l', h('h2', breadcrumbs('/explore/package'))), [
    h('.content', h('h3', 'All packages')),
    list(data, sort(data, Object.keys(data.packageByName)))
  ])
}
