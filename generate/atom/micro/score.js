'use strict'

var h = require('hastscript')
var fmt = require('../../util/fmt-percent.js')
var color = require('../../util/score-color.js')
var icon = require('../icon/score.js')

module.exports = score

function score(value) {
  return value
    ? h('li', {style: 'color:' + color(value)}, [icon(), ' ', fmt(value)])
    : ''
}
