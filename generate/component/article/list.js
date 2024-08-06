/**
 * @import {Element} from 'hast'
 * @import {VFile} from 'vfile'
 * @import {Options} from '../../atom/macro/list.js'
 */

/**
 * @typedef Metadata
 * @property {string | undefined} [description]
 * @property {ReadonlyArray<VFile> | undefined} [entries]
 * @property {string} origin
 * @property {string} pathname
 * @property {string | undefined} [slug]
 * @property {Array<string> | undefined} [tags]
 * @property {string | undefined} [title]
 */

import {list as cards} from '../../atom/card/list.js'
import {item} from './item.js'
import {more} from './more.js'

/**
 * @param {string} href
 * @param {Array<VFile>} d
 * @param {Options | undefined} [options]
 * @returns {Element}
 */
export function list(href, d, options) {
  return cards(d, item, {more: map, ...options})
  /**
   * @param {number} rest
   * @returns {Element}
   */
  function map(rest) {
    return more(href, rest)
  }
}
