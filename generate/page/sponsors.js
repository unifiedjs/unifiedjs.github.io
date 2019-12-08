'use strict'

var h = require('hastscript')
var breadcrumbs = require('../molecule/breadcrumbs')
var list = require('../component/sponsor/list')
var byline = require('../component/sponsor/byline')
var page = require('./page')

module.exports = sponsor

function sponsor(sponsors) {
  return page(
    h('.row-l.column-l', h('h2', breadcrumbs('/community/sponsor/'))),
    [h('.article.content', [h('h3', 'Sponsors'), byline()]), list(sponsors)]
  )
}
