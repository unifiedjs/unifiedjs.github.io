'use strict'

var h = require('hastscript')
var breadcrumbs = require('../molecule/breadcrumbs.js')
var detail = require('../component/article/detail.js')
var page = require('./page.js')

module.exports = article

function article(tree, file) {
  var {matter, meta} = file.data
  var {title} = matter
  var {pathname} = meta

  return page(h('.row-l.column-l', h('h2', breadcrumbs(pathname, title))), [
    detail(tree, file)
  ])
}
