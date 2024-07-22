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
  return card('/community/release/', [
    'See ',
    fmtCompact(rest),
    ' other ',
    fmtPlural(rest, {one: 'release', other: 'releases'})
  ])
}
