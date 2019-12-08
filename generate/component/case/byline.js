'use strict'

var h = require('hastscript')

module.exports = byline

function byline() {
  return h('p', [
    'Thousands of interesting projects are made with unified, mixing and ',
    'matching building blocks together. ',
    'A couple of interesting cases made with unified are shown here.'
  ])
}
