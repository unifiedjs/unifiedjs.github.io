'use strict'

var h = require('hastscript')
var breadcrumbs = require('../molecule/breadcrumbs.js')
var list = require('../component/case/list.js')
var byline = require('../component/case/byline.js')
var page = require('./page.js')

module.exports = showcase

function showcase(showcase) {
  return page(h('.row-l.column-l', h('h2', breadcrumbs('/community/case/'))), [
    h('.article.content', [h('h3', 'Showcase'), byline()]),
    list(showcase)
  ])
}
