/**
 * @import {ElementContent} from 'hast'
 */

import {h} from 'hastscript'
import {npm as icon} from '../icon/npm.js'

/**
 * @param {string} name
 * @returns {ElementContent}
 */
export function npm(name) {
  let node = icon()

  if (name) {
    const href =
      'https://www.npmjs.com/' +
      (name.charAt(0) === '~' ? '' : 'package/') +
      name
    node = h('a.tap-target', {href}, node)
  }

  return h('li', {}, node)
}
