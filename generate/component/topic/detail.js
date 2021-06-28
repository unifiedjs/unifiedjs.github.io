import {h} from 'hastscript'
import {more} from '../../atom/box/more.js'
import {list} from '../project/list.js'
import {helperSort} from '../project/helper-sort.js'

export function detail(data, d) {
  var {projectsByTopic} = data

  var trail = more('https://github.com/topics/' + d, [
    'Find other projects matching ',
    h('span.tag', d),
    ' on GitHub'
  ])

  return [
    h('.content', h('h3', ['Projects matching ', d])),
    list(data, helperSort(data, projectsByTopic[d]), {trail})
  ]
}
