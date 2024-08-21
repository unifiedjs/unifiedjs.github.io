/**
 * @import {SponsorRaw as GhSponsor} from '../../../crawl/github-sponsors.js'
 * @import {Sponsor as OcSponsor} from '../../../crawl/opencollective.js'
 */

import {sort} from '../../util/sort.js'

/**
 * Sort sponsors by `total`.
 *
 * @param {ReadonlyArray<GhSponsor | OcSponsor>} sponsors
 * @returns {Array<GhSponsor | OcSponsor>}
 */
export function helperSort(sponsors) {
  return sort(sponsors, score)

  /**
   * @param {GhSponsor | OcSponsor} d
   * @returns {number}
   */
  function score(d) {
    return d.total
  }
}
