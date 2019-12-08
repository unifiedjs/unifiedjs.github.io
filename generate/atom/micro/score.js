'use strict'

var h = require('hastscript')
var fmt = require('../../util/fmt-percent')
var color = require('../../util/score-color')
var icon = require('../icon/score')

module.exports = score

function score(value) {
  return value
    ? h('li', {style: 'color:' + color(value)}, [icon(), ' ', fmt(value)])
    : ''
}
