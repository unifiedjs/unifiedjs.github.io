'use strict'

var head = require('../component/project/head.js')
var detail = require('../component/project/detail.js')
var page = require('./page.js')

module.exports = project

function project(data, d) {
  return page(head(data, d), detail(data, d))
}
