/**
 * @import {Root} from 'hast'
 * @import {VFile} from 'vfile'
 */

import assert from 'node:assert/strict'
import {h} from 'hastscript'
import {detail} from '../component/article/detail.js'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {page} from './page.js'

/**
 * @param {Root} tree
 * @param {VFile} file
 * @returns {Root}
 */
export function article(tree, file) {
  const {matter, meta} = file.data
  assert(matter)
  assert(meta)
  const {title} = matter
  const {pathname} = meta
  assert(pathname)

  return page(
    h('.row-l.column-l', {}, h('h2', {}, breadcrumbs(pathname, title))),
    [detail(tree)]
  )
}
