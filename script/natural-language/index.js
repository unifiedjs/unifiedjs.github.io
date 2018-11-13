'use strict'

var unified = require('unified')
var preset = require('./preset')

module.exports = unified()
  .use(preset)
  .freeze()
