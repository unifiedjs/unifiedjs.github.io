'use strict'

var h = require('hastscript')
var breadcrumbs = require('../molecule/breadcrumbs.js')
var byline = require('../component/member/byline.js')
var list = require('../component/member/list.js')
var sort = require('../component/member/helper-sort.js')
var page = require('./page.js')

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
