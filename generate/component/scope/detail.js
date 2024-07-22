/**
 * @import {ElementContent} from 'hast'
 * @import {Data} from '../../data.js'
 */

import {h} from 'hastscript'
import {list} from '../package/list.js'
import {helperSort} from '../package/helper-sort.js'

/**
 * @param {Data} data
 * @param {string} d
 * @returns {Array<ElementContent>}
 */
export function detail(data, d) {
  const {packagesByScope} = data

  return [
    h('.content', {}, h('h3', ['Packages in scope ', d])),
    list(data, helperSort(data, packagesByScope[d]))
  ]
}
