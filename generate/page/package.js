'use strict'

var head = require('../component/package/head.js')
var detail = require('../component/package/detail.js')
var page = require('./page.js')

module.exports = pkg

function pkg(data, d, tree) {
  return page(head(data, d), detail(data, d, tree))
}
