/**
 * @import {ElementContent} from 'hast'
 * @import {Data} from '../../data.js'
 */

import {h} from 'hastscript'

/**
 * @param {Data} data
 * @param {string} query
 * @returns {ElementContent}
 */
export function searchEmpty(data, query) {
  return h('p.content', [
    'We couldn’t find any projects matching “',
    query,
    '”. ',
    h('a', {href: '/explore/project/'}, 'Browse projects'),
    ' instead.'
  ])
}
