import {h} from 'hastscript'
import {fmtCompact} from '../../util/fmt-compact.js'
import {fmtPlural} from '../../util/fmt-plural.js'
import {more as box} from '../../atom/box/more.js'
import {helperSort} from '../package/helper-sort.js'
import {list} from '../package/list.js'

export function item(data, d) {
  const {packagesByKeyword} = data

  return [
    h('.content', h('h3', d)),
    list(data, helperSort(data, packagesByKeyword[d]), {max: 3, more})
  ]

  function more(rest) {
    return box('/explore/keyword/' + d + '/', [
      'Explore ',
      fmtCompact(rest),
      ' other ',
      fmtPlural(rest, {one: 'package', other: 'packages'}),
      ' matching ',
      h('span.tag', d)
    ])
  }
}
