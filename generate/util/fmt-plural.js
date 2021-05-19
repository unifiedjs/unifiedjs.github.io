'use strict'

var locale = require('./constant-locale.js')

module.exports = plural

var plurals = new Intl.PluralRules(locale)

function plural(count, rules) {
  return rules[plurals.select(count || 0)] || rules.other
}
