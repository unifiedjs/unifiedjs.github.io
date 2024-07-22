/**
 * @import {ElementContent} from 'hast'
 */

import {more as card} from '../../atom/card/more.js'
import {fmtCompact} from '../../util/fmt-compact.js'
import {fmtPlural} from '../../util/fmt-plural.js'

/**
 * @param {number} rest
 * @returns {ElementContent}
 */
export function more(rest) {
  return card('/community/member/', [
    'See ',
    fmtCompact(rest),
    ' other ',
    fmtPlural(rest, {one: 'member', other: 'members'})
  ])
}
