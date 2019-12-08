'use strict'

var h = require('hastscript')
var list = require('../package/list')
var sort = require('../package/helper-sort')

module.exports = detail

function detail(data, d) {
  var {packagesByScope} = data

  return [
    h('.content', h('h3', ['Packages in scope ', d])),
    list(data, sort(data, packagesByScope[d]))
  ]
}
