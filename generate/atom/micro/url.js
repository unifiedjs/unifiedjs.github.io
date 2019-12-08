'use strict'

var h = require('hastscript')
var fmt = require('../../util/fmt-url')
var icon = require('../icon/link')

module.exports = url

function url(value) {
  return value
    ? h('li.ellipsis', h('a', {href: value}, [icon(), ' ', fmt(value)]))
    : ''
}
