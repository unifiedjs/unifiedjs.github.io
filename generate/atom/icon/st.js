'use strict'

var s = require('hastscript/svg')

module.exports = st

function st() {
  return s(
    'svg.icon',
    {
      ariaLabel: 'Spectrum',
      viewBox: [0, 0, 32, 32],
      width: 18,
      height: 18,
      role: 'img'
    },
    s('path', {
      fill: 'currentcolor',
      d:
        'M6 14.5A1.5 1.5 0 007.5 16H9a7 7 0 017 7v1.5a1.5 1.5 0 001.5 1.5h7a1.5 1.5 0 001.5-1.5V23c0-9.389-7.611-17-17-17H7.5A1.5 1.5 0 006 7.5v7z'
    })
  )
}
