/**
 * @import {Metadata} from './list.js'
 */

import {more as card} from '../../atom/card/more.js'
import {fmtCompact} from '../../util/fmt-compact.js'
import {fmtPlural} from '../../util/fmt-plural.js'

/**
 * @param {string} href
 * @param {number} rest
 */
export function more(href, rest) {
  return card(href, [
    'See ',
    fmtCompact(rest),
    ' other ',
    fmtPlural(rest, {one: 'article', other: 'articles'})
  ])
}
