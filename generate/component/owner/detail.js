import {h} from 'hastscript'
import {more} from '../../atom/box/more.js'
import {list} from '../project/list.js'
import {helperSort} from '../project/helper-sort.js'

export function detail(data, d) {
  var {projectsByOwner} = data

  var trail = more(
    'https://github.com/search?o=desc&s=stars&type=Repositories&q=user:' + d,
    ['Find other projects by owner @', d, ' on GitHub']
  )

  return [
    h('.content', h('h3', ['Projects by owner @', d])),
    list(data, helperSort(data, projectsByOwner[d]), {trail})
  ]
}
