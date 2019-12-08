'use strict'

var h = require('hastscript')
var breadcrumbs = require('../molecule/breadcrumbs')
var detail = require('../component/keyword/detail')
var page = require('./page')

module.exports = keywords

function keywords(data, d) {
  return page(
    h('.row-l.column-l', h('h2', breadcrumbs('/explore/keyword/' + d))),
    detail(data, d)
  )
}
