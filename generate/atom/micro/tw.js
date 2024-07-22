/**
 * @import {ElementContent} from 'hast'
 */

import {h} from 'hastscript'
import {tw as icon} from '../icon/tw.js'

/**
 * @param {string} name
 * @returns {ElementContent}
 */
export function tw(name) {
  let node = icon()

  if (name) {
    node = h('a.tap-target', {href: 'https://twitter.com/' + name}, node)
  }

  return h('li', {}, node)
}
