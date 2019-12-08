'use strict'

var tag = require('../../atom/micro/tag')

module.exports = item

function item(data, d) {
  var {packagesByKeyword} = data

  return tag(
    d,
    (packagesByKeyword[d] || []).length,
    '/explore/keyword/' + d + '/'
  )
}
