/**
 * @import {Root} from 'hast'
 * @import {Metadata} from '../component/article/list.js'
 * @import {VFile} from 'vfile'
 */

import {h} from 'hastscript'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {list} from '../component/article/list.js'
import {helperSort} from '../component/article/helper-sort.js'
import {page} from './page.js'

/**
 * @param {Metadata} section
 * @param {ReadonlyArray<VFile>} articles
 * @returns {Root}
 */
export function articles(section, articles) {
  const {title, pathname, description} = section

  return page(
    h('.row-l.column-l', {}, h('h2', {}, breadcrumbs(pathname, title))),
    [
      h('.article.content', [h('h3', {}, title), h('p', {}, description)]),
      list(section, helperSort(articles))
    ]
  )
}
