import {h} from 'hastscript'
import {list} from '../package/list.js'
import {helperSort} from '../package/helper-sort.js'

export function detail(data, d) {
  const {packagesByRepo} = data
  const packages = packagesByRepo[d]

  return [
    h(
      '.content',
      h('h3', ['Packages in ', packages.length > 1 ? 'monorepo' : 'project'])
    ),
    list(data, helperSort(data, packages))
  ]
}
