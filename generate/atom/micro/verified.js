'use strict'

var h = require('hastscript')
var collective = require('../../util/constant-collective.js')
var icon = require('../icon/verified.js')

module.exports = verified

function verified(name) {
  return collective.includes(name.split('/')[0]) ? h('li', icon()) : ''
}
