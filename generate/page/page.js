'use strict'

var h = require('hastscript')

module.exports = page

function page(heading, main) {
  return {
    type: 'root',
    children: [
      heading && heading.length !== 0 ? h('section.container', heading) : '',
      main && main.length !== 0 ? h('main.container', main) : ''
    ]
  }
}
