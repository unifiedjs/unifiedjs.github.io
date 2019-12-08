'use strict'

var h = require('hastscript')

module.exports = detail

function detail(article) {
  return h('.content.article', article.children)
}
