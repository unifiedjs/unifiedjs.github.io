import h from 'hastscript'
import {gh as ghBadge} from '../../atom/micro/gh.js'
import {url as urlLine} from '../../atom/micro/url.js'
import {item as card} from '../../atom/card/item.js'

export function item(d) {
  var {title, short, url, gh, src} = d
  var footer = []

  if (gh) {
    footer.push(ghBadge(gh))
  }

  if (url) {
    footer.push(urlLine(url))
  }

  return card(
    url,
    [
      h('.screen', h('img', {src, alt: ''})),
      h('.column', [
        h('h3.row', [h('span.ellipsis', title)]),
        h('p.double-ellipsis', short)
      ])
    ],
    footer
  )
}
