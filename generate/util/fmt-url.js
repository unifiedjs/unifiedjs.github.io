'use strict'

var fmt = require('humanize-url')

module.exports = url

function url(value) {
  return fmt(value || '')
}
