/**
 * @import {ElementContent} from 'hast'
 * @import {Data} from '../data.js'
 */

import {h} from 'hastscript'
import pickRandom from 'pick-random'
import {helperSort} from '../component/package/helper-sort.js'

/**
 * @param {Data} data
 * @param {string} name
 * @returns {ElementContent}
 */
export function search(data, name) {
  const names = Object.keys(data.packageByName)
  const random = pickRandom(helperSort(data, names).slice(0, 75))[0]

  return h('form.search', {action: '/explore/'}, [
    h('label', {htmlFor: name}, 'Search ecosystem:'),
    h('.row', [
      h('input.flex', {
        autoCapitalize: 'none',
        autoComplete: 'off',
        autoCorrect: 'off',
        id: name,
        name,
        placeholder: 'Such as for “' + random + '”',
        type: 'search'
      }),
      h('button', 'Submit')
    ])
  ])
}
