/**
 * @import {Element} from 'hast'
 */

import {s} from 'hastscript'

/**
 * @returns {Element}
 */
export function npm() {
  return s(
    'svg.icon',
    {
      ariaLabel: 'npm',
      viewBox: [3.8, 3.8, 19.7, 19.7],
      width: 18,
      height: 18,
      role: 'img'
    },
    [
      s('path', {
        fill: 'currentcolor',
        d: 'M5.8 21.75h7.86l.01-11.77h3.92l-.01 11.78h3.93l.01-15.7-15.7-.02-.02 15.71z'
      })
    ]
  )
}
