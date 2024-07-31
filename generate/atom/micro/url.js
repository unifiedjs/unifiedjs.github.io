/**
 * @import {ElementContent, Properties} from 'hast'
 */

import {h} from 'hastscript'
import {fmtUrl} from '../../util/fmt-url.js'
import {link as icon} from '../icon/link.js'

/**
 * @param {string} value
 * @param {Properties | undefined} [linkProperties]
 * @returns {ElementContent}
 */
export function url(value, linkProperties) {
  return h(
    'li.ellipsis',
    h('a.tap-target', {...linkProperties, href: value}, [
      icon(),
      ' ',
      fmtUrl(value)
    ])
  )
}
