/**
 * @import {Element} from 'hast'
 * @import {Options} from '../../atom/macro/list.js'
 * @import {Metadata} from './item.js'
 */

import {list as cards} from '../../atom/card/list.js'
import {item} from './item.js'
import {more} from './more.js'

/**
 * @param {ReadonlyArray<Metadata>} d
 * @param {Options} [options]
 * @returns {Element}
 */
export function list(d, options) {
  return cards(d, item, {more, ...options})
}
