'use strict'

var h = require('hastscript')
var box = require('../../atom/box/more.js')
var list = require('../project/list.js')
var sort = require('../project/helper-sort.js')

module.exports = detail

function detail(data, d) {
  var {projectsByTopic} = data

  var trail = box('https://github.com/topics/' + d, [
    'Find other projects matching ',
    h('span.tag', d),
    ' on GitHub'
  ])

  return [
    h('.content', h('h3', ['Projects matching ', d])),
    list(data, sort(data, projectsByTopic[d]), {trail})
  ]
}
