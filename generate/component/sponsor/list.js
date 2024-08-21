/**
 * @import {Element} from 'hast'
 * @import {SponsorRaw as GhSponsor} from '../../../crawl/github-sponsors.js'
 * @import {Sponsor as OcSponsor} from '../../../crawl/opencollective.js'
 * @import {Options} from '../../atom/macro/list.js'
 */

import {list as cards} from '../../atom/card/list.js'
import {item} from './item.js'
import {more} from './more.js'

/**
 * @param {ReadonlyArray<GhSponsor | OcSponsor>} d
 * @param {Options | undefined} [options]
 * @returns {Element}
 */
export function list(d, options) {
  return cards(d, item, {more, ...options})
}
