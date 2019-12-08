'use strict'

var h = require('hastscript')

module.exports = detail

function detail(data, d, tree) {
  return h('.content.readme', tree)
}
