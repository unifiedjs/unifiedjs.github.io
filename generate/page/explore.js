/**
 * @import {Root} from 'hast'
 * @import {Data} from '../data.js'
 */

import {h} from 'hastscript'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {searchPreview as packagePreview} from '../component/package/search-preview.js'
import {searchPreview as keywordPreview} from '../component/keyword/search-preview.js'
import {searchPreview as projectPreview} from '../component/project/search-preview.js'
import {searchPreview as topicPreview} from '../component/topic/search-preview.js'
import {explorePreview as release} from '../component/release/explore-preview.js'
import {page} from './page.js'

/**
 * @param {Data} data
 * @returns {Root}
 */
export function explore(data) {
  return page(h('.row-l.column-l', {}, h('h2', {}, breadcrumbs('/explore/'))), [
    h('#search-root', [
      h('.content', {}, h('h3', 'Packages')),
      h('#root-keyword', {}, keywordPreview()),
      h('#root-package', {}, packagePreview(data)),
      h('.content', {}, h('h3', 'Projects')),
      h('#root-topic', {}, topicPreview()),
      h('#root-project', {}, projectPreview(data)),
      h('#root-release', [
        h('.content', {}, h('h3', 'Recent releases')),
        release(data)
      ])
    ])
  ])
}
