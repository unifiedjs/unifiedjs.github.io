/**
 * @import {ElementContent, Properties} from 'hast'
 */

import {h} from 'hastscript'
import {fmtUrl} from '../../util/fmt-url.js'
import {link as icon} from '../icon/link.js'

/**
 * @param {string} value
 * @param {Properties | undefined} [linkProps]
 * @returns {ElementContent}
 */
export function url(value, linkProps) {
  return h(
    'li.ellipsis',
    h('a.tap-target', {...linkProps, href: value}, [icon(), ' ', fmtUrl(value)])
  )
}
