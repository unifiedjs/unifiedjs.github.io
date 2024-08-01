/**
 * @import {Root} from 'hast'
 * @import {Data} from '../data.js'
 */

import {detail} from '../component/package/detail.js'
import {head} from '../component/package/head.js'
import {page} from './page.js'

/**
 * @param {Data} data
 * @param {string} d
 * @param {Root} tree
 * @returns {Root}
 */
export function renderPackage(data, d, tree) {
  return page(head(data, d), [detail(data, d, tree)])
}
