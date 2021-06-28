import {h} from 'hastscript'

export function description(value, rich) {
  return h('li.ellipsis.content', rich ? rich.children : value)
}
