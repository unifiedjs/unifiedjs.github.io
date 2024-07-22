/**
 * @import {ElementContent} from 'hast'
 * @import {Data} from '../../data.js'
 */

import {tag} from '../../atom/micro/tag.js'

/**
 * @param {Data} data
 * @param {string} d
 * @returns {ElementContent}
 */
export function itemSmall(data, d) {
  const {packagesByKeyword} = data

  return tag(
    d,
    (packagesByKeyword[d] || []).length,
    '/explore/keyword/' + d + '/'
  )
}
