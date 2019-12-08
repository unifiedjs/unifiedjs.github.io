'use strict'

var h = require('hastscript')
var breadcrumbs = require('../molecule/breadcrumbs')
var detail = require('../component/owner/detail')
var page = require('./page')

module.exports = owner

function owner(data, d) {
  return page(
    h('.row-l.column-l', h('h2', breadcrumbs('/explore/project/' + d))),
    detail(data, d)
  )
}
