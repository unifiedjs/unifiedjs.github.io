/**
 * @import {Element} from 'hast'
 * @import {SponsorRaw as GhSponsor} from '../../../crawl/github-sponsors.js'
 * @import {Sponsor as OcSponsor} from '../../../crawl/opencollective.js'
 */

import {h} from 'hastscript'
import {item as card} from '../../atom/card/item.js'
import {gh as ghBadge} from '../../atom/micro/gh.js'
import {oc as ocBadge} from '../../atom/micro/oc.js'
import {url as urlLine} from '../../atom/micro/url.js'

const gh = 'https://github.com/'
const oc = 'https://opencollective.com/'

/**
 * @param {GhSponsor | OcSponsor} d
 * @returns {Element}
 */
export function item(d) {
  const footer = []

  if ('oc' in d && d.oc) {
    footer.push(ocBadge(d.oc))
  }

  if (d.github) {
    footer.push(ghBadge(d.github))
  }

  if (d.url) {
    footer.push(urlLine(d.url, {rel: ['nofollow', 'sponsored']}))
  }

  return card(
    'oc' in d ? oc + d.oc : gh + d.github,
    h('.column', [
      h('h3.row', [
        h('.thumbnail', {
          role: 'presentation',
          style: 'background-image:url(' + d.image + ')'
        }),
        h('span.ellipsis', {}, d.name || d.github)
      ]),
      d.description ? h('p.double-ellipsis', {}, d.description) : []
    ]),
    footer
  )
}
