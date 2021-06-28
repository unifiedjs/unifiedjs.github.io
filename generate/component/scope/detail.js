import {h} from 'hastscript'
import {list} from '../package/list.js'
import {helperSort} from '../package/helper-sort.js'

export function detail(data, d) {
  var {packagesByScope} = data

  return [
    h('.content', h('h3', ['Packages in scope ', d])),
    list(data, helperSort(data, packagesByScope[d]))
  ]
}
