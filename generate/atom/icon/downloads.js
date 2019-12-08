'use strict'

var s = require('hastscript/svg')

module.exports = downloads

function downloads() {
  return s(
    'svg.icon',
    {
      ariaLabel: 'downloads',
      viewBox: [1, 1, 8, 14],
      width: 18,
      height: 18,
      role: 'img'
    },
    s('path', {
      fill: 'currentcolor',
      fillRule: 'evenodd',
      d: 'M7 7V3H3v4H0l5 6 5-6H7z'
    })
  )
}
