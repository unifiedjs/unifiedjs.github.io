'use strict'

var h = require('hastscript')
var breadcrumbs = require('../molecule/breadcrumbs.js')
var list = require('../component/article/list.js')
var sort = require('../component/article/helper-sort.js')
var page = require('./page.js')

module.exports = articles

function articles(section, articles) {
  var {title, pathname, description} = section

  return page(h('.row-l.column-l', h('h2', breadcrumbs(pathname, title))), [
    h('.article.content', [h('h3', title), h('p', description)]),
    list(section, sort(articles))
  ])
}
