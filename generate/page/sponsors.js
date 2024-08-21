/**
 * @import {Root} from 'hast'
 * @import {SponsorRaw as GhSponsor} from '../../crawl/github-sponsors.js'
 * @import {Sponsor as OcSponsor} from '../../crawl/opencollective.js'
 */

import {h} from 'hastscript'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {byline} from '../component/sponsor/byline.js'
import {helperSort} from '../component/sponsor/helper-sort.js'
import {list} from '../component/sponsor/list.js'
import {page} from './page.js'

/**
 * @param {ReadonlyArray<GhSponsor | OcSponsor>} sponsors
 * @returns {Root}
 */
export function sponsor(sponsors) {
  return page(
    h('.row-l.column-l', {}, h('h2', {}, breadcrumbs('/community/sponsor/'))),
    [
      h('.article.content', [h('h3', 'Sponsors'), byline()]),
      list(helperSort(sponsors))
    ]
  )
}
