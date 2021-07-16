import {h} from 'hastscript'

export function page(heading, main) {
  return {
    type: 'root',
    children: [
      heading && (!Array.isArray(heading) || heading.length > 0)
        ? h('section.container', heading)
        : '',
      main && (!Array.isArray(main) || main.length > 0)
        ? h('main.container', main)
        : ''
    ]
  }
}
