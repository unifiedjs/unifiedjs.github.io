'use strict'

var h = require('hastscript')
var box = require('../../atom/box/more.js')
var list = require('../project/list.js')
var sort = require('../project/helper-sort.js')

module.exports = detail

function detail(data, d) {
  var {projectsByOwner} = data

  var trail = box(
    'https://github.com/search?o=desc&s=stars&type=Repositories&q=user:' + d,
    ['Find other projects by owner @', d, ' on GitHub']
  )

  return [
    h('.content', h('h3', ['Projects by owner @', d])),
    list(data, sort(data, projectsByOwner[d]), {trail})
  ]
}
