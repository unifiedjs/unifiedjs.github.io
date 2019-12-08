'use strict'

var head = require('../component/project/head')
var detail = require('../component/project/detail')
var page = require('./page')

module.exports = project

function project(data, d) {
  return page(head(data, d), detail(data, d))
}
