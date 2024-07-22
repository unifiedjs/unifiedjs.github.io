/**
 * @import {Element, Root} from 'hast'
 */

import {h} from 'hastscript'

/**
 * @param {unknown} data
 * @param {unknown} d
 * @param {Root} tree
 * @returns {Element}
 */
export function detail(data, d, tree) {
  return h('.content.readme', {}, tree)
}
