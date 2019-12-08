'use strict'

var abbr = require('number-abbreviate')

// Would like to use: `.toLocaleString(locale, {notation: 'compact'})`,
// but that’s not widely supported yet.

module.exports = compact

function compact(value) {
  return String(abbr(value || 0))
}
