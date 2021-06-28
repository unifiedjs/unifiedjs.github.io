import {more} from '../../atom/box/more.js'
import {fmtCompact} from '../../util/fmt-compact.js'
import {pickRandom} from '../../util/pick-random.js'
import {list} from './list.js'
import {helperSort} from './helper-sort.js'

export function searchPreview(data) {
  var {packageByName} = data
  var names = helperSort(data, Object.keys(packageByName))
  var d = pickRandom(names.slice(0, 75), 5)

  var trail = more('/explore/package/', [
    'Explore the ',
    fmtCompact(names.length),
    ' packages in the ecosystem'
  ])

  return list(data, d, {trail})
}
