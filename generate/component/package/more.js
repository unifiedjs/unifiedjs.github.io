import {more as box} from '../../atom/box/more.js'
import {fmtCompact} from '../../util/fmt-compact.js'
import {fmtPlural} from '../../util/fmt-plural.js'

export function more(rest) {
  return box('/explore/package/', [
    'See ',
    fmtCompact(rest),
    ' other ',
    fmtPlural(rest, {one: 'package', other: 'packages'})
  ])
}
