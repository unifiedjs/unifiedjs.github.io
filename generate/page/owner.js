'use strict'

var h = require('hastscript')
var breadcrumbs = require('../molecule/breadcrumbs.js')
var detail = require('../component/owner/detail.js')
var page = require('./page.js')

module.exports = owner

function owner(data, d) {
  return page(
    h('.row-l.column-l', h('h2', breadcrumbs('/explore/project/' + d))),
    detail(data, d)
  )
}
