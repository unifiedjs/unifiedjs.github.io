'use strict'

var h = require('hastscript')
var breadcrumbs = require('../molecule/breadcrumbs.js')
var list = require('../component/release/list.js')
var filter = require('../component/release/helper-filter.js')
var sort = require('../component/release/helper-sort.js')
var page = require('./page.js')
var dataReleases = require('../../data/releases.json')

module.exports = releases

function releases(data) {
  return page(
    h('.row-l.column-l', h('h2', breadcrumbs('/explore/release/'))),
    list(data, filter(data, sort(data, dataReleases)))
  )
}
