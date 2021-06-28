import {h} from 'hastscript'
import {more} from '../../atom/box/more.js'
import {helperSort} from '../package/helper-sort.js'
import {list} from '../package/list.js'

export function detail(data, d) {
  const {packagesByKeyword} = data

  const trail = more('https://www.npmjs.com/search?q=keywords:' + d, [
    'Find other packages matching ',
    h('span.tag', d),
    ' on npm'
  ])

  return [
    h('.content', h('h3', ['Packages matching ', d])),
    list(data, helperSort(data, packagesByKeyword[d]), {trail})
  ]
}
