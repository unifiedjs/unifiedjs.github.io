'use strict'

var h = require('hastscript')
var breadcrumbs = require('../molecule/breadcrumbs.js')
var detail = require('../component/topic/detail.js')
var page = require('./page.js')

module.exports = keywords

function keywords(data, d) {
  return page(
    h('.row-l.column-l', h('h2', breadcrumbs('/explore/topic/' + d))),
    detail(data, d)
  )
}
