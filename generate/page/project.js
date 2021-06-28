import {head} from '../component/project/head.js'
import {detail} from '../component/project/detail.js'
import {page} from './page.js'

export function project(data, d) {
  return page(head(data, d), detail(data, d))
}
