'use strict'

var h = require('hastscript')
var pick = require('pick-random')
var sortPackages = require('../component/package/helper-sort.js')

module.exports = search

function search(data, name) {
  var names = Object.keys(data.packageByName)
  var random = pick(sortPackages(data, names).slice(0, 75))[0]

  return h('form.search', {action: '/explore/'}, [
    h('label', {for: name}, 'Search ecosystem:'),
    h('.row', [
      h('input.flex', {
        id: name,
        name,
        type: 'search',
        autoComplete: 'off',
        autoCorrect: 'off',
        autoCapitalize: 'none',
        placeholder: 'Such as for “' + random + '”'
      }),
      h('button', 'Submit')
    ])
  ])
}
