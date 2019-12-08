'use strict'

var head = require('../component/package/head')
var detail = require('../component/package/detail')
var page = require('./page')

module.exports = pkg

function pkg(data, d, tree) {
  return page(head(data, d), detail(data, d, tree))
}
