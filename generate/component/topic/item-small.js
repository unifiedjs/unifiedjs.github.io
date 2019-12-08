'use strict'

var tag = require('../../atom/micro/tag')

module.exports = item

function item(data, d) {
  var {projectsByTopic} = data

  return tag(d, (projectsByTopic[d] || []).length, '/explore/topic/' + d + '/')
}
