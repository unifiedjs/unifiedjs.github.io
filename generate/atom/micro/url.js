'use strict'

var h = require('hastscript')
var fmt = require('../../util/fmt-url.js')
var icon = require('../icon/link.js')

module.exports = url

function url(value, linkProps) {
  return value
    ? h(
        'li.ellipsis',
        h('a.tap-target', {...linkProps, href: value}, [
          icon(),
          ' ',
          fmt(value)
        ])
      )
    : ''
}
