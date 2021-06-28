import {h} from 'hastscript'

export function block(main, footer) {
  return h(
    'li',
    {className: footer ? ['nl-root'] : []},
    [].concat(main, footer ? h('.nl-foot', footer) : [])
  )
}
