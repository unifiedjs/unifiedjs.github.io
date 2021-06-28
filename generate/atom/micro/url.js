import {h} from 'hastscript'
import {fmtUrl} from '../../util/fmt-url.js'
import {link as icon} from '../icon/link.js'

export function url(value, linkProps) {
  return value
    ? h(
        'li.ellipsis',
        h('a.tap-target', {...linkProps, href: value}, [
          icon(),
          ' ',
          fmtUrl(value)
        ])
      )
    : ''
}
