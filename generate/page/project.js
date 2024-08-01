/**
 * @import {Root} from 'hast'
 * @import {Data} from '../data.js'
 */

import {detail} from '../component/project/detail.js'
import {head} from '../component/project/head.js'
import {page} from './page.js'

/**
 * @param {Data} data
 * @param {string} d
 * @returns {Root}
 */
export function project(data, d) {
  return page(head(data, d), detail(data, d))
}
