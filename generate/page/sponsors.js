'use strict'

var h = require('hastscript')
var breadcrumbs = require('../molecule/breadcrumbs.js')
var list = require('../component/sponsor/list.js')
var byline = require('../component/sponsor/byline.js')
var page = require('./page.js')

module.exports = sponsor

function sponsor(sponsors) {
  return page(
    h('.row-l.column-l', h('h2', breadcrumbs('/community/sponsor/'))),
    [h('.article.content', [h('h3', 'Sponsors'), byline()]), list(sponsors)]
  )
}
