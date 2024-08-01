/**
 * @import {Element} from 'hast'
 * @import {Data} from '../../data.js'
 */

import {h} from 'hastscript'
import {helperSort} from '../package/helper-sort.js'
import {list} from '../package/list.js'

/**
 * @param {Data} data
 * @param {string} d
 * @returns {Array<Element>}
 */
export function detail(data, d) {
  const {packagesByRepo} = data
  const packages = packagesByRepo[d] || []

  return [
    h(
      '.content',
      h('h3', ['Packages in ', packages.length > 1 ? 'monorepo' : 'project'])
    ),
    list(data, helperSort(data, packages))
  ]
}
