/**
 * @import {PluralRules} from '../types.js'
 */

import {constantLocale} from './constant-locale.js'

const plurals = new Intl.PluralRules(constantLocale)

/**
 * @param {number} count
 * @param {PluralRules} rules
 * @returns {string}
 */
export function fmtPlural(count, rules) {
  return rules[plurals.select(count)] || rules.other
}
