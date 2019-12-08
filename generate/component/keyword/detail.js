'use strict'

var h = require('hastscript')
var box = require('../../atom/box/more')
var sort = require('../package/helper-sort')
var list = require('../package/list')

module.exports = detail

function detail(data, d) {
  var {packagesByKeyword} = data

  var trail = box('https://www.npmjs.com/search?q=keywords:' + d, [
    'Find other packages matching ',
    h('span.tag', d),
    ' on npm'
  ])

  return [
    h('.content', h('h3', ['Packages matching ', d])),
    list(data, sort(data, packagesByKeyword[d]), {trail})
  ]
}
