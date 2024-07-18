import {h} from 'hastscript'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {searchPreview as pkg} from '../component/package/search-preview.js'
import {searchPreview as keyword} from '../component/keyword/search-preview.js'
import {searchPreview as project} from '../component/project/search-preview.js'
import {searchPreview as topic} from '../component/topic/search-preview.js'
import {explorePreview as release} from '../component/release/explore-preview.js'
import {page} from './page.js'

export function explore(data) {
  return page(h('.row-l.column-l', {}, h('h2', {}, breadcrumbs('/explore/'))), [
    h('#search-root', [
      h('.content', {}, h('h3', 'Packages')),
      h('#root-keyword', {}, keyword(data)),
      h('#root-package', {}, pkg(data)),
      h('.content', {}, h('h3', 'Projects')),
      h('#root-topic', {}, topic(data)),
      h('#root-project', {}, project(data)),
      h('#root-release', [
        h('.content', {}, h('h3', 'Recent releases')),
        release(data)
      ])
    ])
  ])
}
