'use strict'

var h = require('hastscript')
var breadcrumbs = require('../molecule/breadcrumbs')
var byline = require('../component/member/byline')
var list = require('../component/member/list')
var sort = require('../component/member/helper-sort')
var page = require('./page')

module.exports = members

function members(data) {
  return page(
    h('.row-l.column-l', h('h2', breadcrumbs('/community/member/'))),
    [
      h('.article.content', [h('h3', 'Team'), byline()]),
      list(data, sort(data, data.humans))
    ]
  )
}
