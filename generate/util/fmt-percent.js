'use strict'

var locale = require('./constant-locale.js')

module.exports = percent

function percent(value) {
  return (value || 0).toLocaleString(locale, {style: 'percent'})
}
