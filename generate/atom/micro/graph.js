import {h} from 'hastscript'
import {fmtCompact} from '../../util/fmt-compact.js'

export function graph(dependents, name) {
  let by = [h('span.label', 'Dependents: '), fmtCompact(dependents || 0)]

  if (name) {
    by = h(
      'a.tap-target',
      {href: 'https://www.npmjs.com/browse/depended/' + name},
      by
    )
  }

  return h('li', by)
}
