'use strict'

var h = require('hastscript')
var breadcrumbs = require('../molecule/breadcrumbs')
var list = require('../component/article/list')
var sort = require('../component/article/helper-sort')
var page = require('./page')

module.exports = articles

function articles(section, articles) {
  var {title, pathname, description} = section

  return page(h('.row-l.column-l', h('h2', breadcrumbs(pathname, title))), [
    h('.article.content', [h('h3', title), h('p', description)]),
    list(section, sort(articles))
  ])
}
