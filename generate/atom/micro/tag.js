import {h} from 'hastscript'
import {fmtCompact} from '../../util/fmt-compact.js'

export function tag(label, count, href) {
  const nodes = [label]

  if (count) {
    nodes.push(' ', h('span.count', fmtCompact(count)))
  }

  return h(
    'li.inline-block',
    href ? h('a.tag', {href}, nodes) : h('span.tag', nodes)
  )
}
