/**
 * @import {Element, Parents} from 'hast'
 */

import {h} from 'hastscript'

/**
 * @param {Parents} article
 * @returns {Element}
 */
export function detail(article) {
  return h('.content.article', {}, article.children)
}
