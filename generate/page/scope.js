'use strict'

var h = require('hastscript')
var breadcrumbs = require('../molecule/breadcrumbs')
var detail = require('../component/scope/detail')
var page = require('./page')

module.exports = scope

function scope(data, d) {
  return page(
    h('.row-l.column-l', h('h2', breadcrumbs('/explore/package/' + d))),
    detail(data, d)
  )
}
