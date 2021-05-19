'use strict'

var h = require('hastscript')
var breadcrumbs = require('../molecule/breadcrumbs.js')
var detail = require('../component/scope/detail.js')
var page = require('./page.js')

module.exports = scope

function scope(data, d) {
  return page(
    h('.row-l.column-l', h('h2', breadcrumbs('/explore/package/' + d))),
    detail(data, d)
  )
}
