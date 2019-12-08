'use strict'

var s = require('hastscript/svg')

module.exports = stars

function stars() {
  return s(
    'svg.icon',
    {
      ariaLabel: 'Stars',
      viewBox: [0, 0, 14, 16],
      width: 18,
      height: 18,
      role: 'img'
    },
    s('path', {
      fill: 'currentcolor',
      fillRule: 'evenodd',
      d:
        'M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z'
    })
  )
}
