import {head} from '../component/package/head.js'
import {detail} from '../component/package/detail.js'
import {page} from './page.js'

export function pkg(data, d, tree) {
  return page(head(data, d), detail(data, d, tree))
}
