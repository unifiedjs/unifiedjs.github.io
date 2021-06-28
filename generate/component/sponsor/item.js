import {h} from 'hastscript'
import {oc as ocBadge} from '../../atom/micro/oc.js'
import {gh as ghBadge} from '../../atom/micro/gh.js'
import {tw as twitterBadge} from '../../atom/micro/tw.js'
import {url as urlLine} from '../../atom/micro/url.js'
import {item as card} from '../../atom/card/item.js'

const base = 'http://opencollective.com/'

export function item(d) {
  const {name, description, image, oc, github, twitter, url, gold} = d
  const className = gold ? ['gold'] : []
  const footer = [ocBadge(oc)]

  if (github) {
    footer.push(ghBadge(github))
  }

  if (twitter) {
    footer.push(twitterBadge(twitter))
  }

  if (url) {
    footer.push(urlLine(url, {rel: ['sponsored', 'nofollow']}))
  }

  return card(
    base + oc,
    h('.column', [
      h('h3.row', [
        h('.thumbnail', {
          className,
          role: 'presentation',
          style: 'background-image:url(' + image + ')'
        }),
        h('span.ellipsis', name)
      ]),
      description ? h('p.double-ellipsis', description) : []
    ]),
    footer
  )
}
