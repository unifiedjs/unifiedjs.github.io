/**
 * @typedef {Partial<Record<Intl.LDMLPluralRule, string>>} Rules
 */

import {constantLocale} from './constant-locale.js'

const plurals = new Intl.PluralRules(constantLocale)

// To do: check if `other` needs to be made required?
/**
 * @param {number} count
 * @param {Rules} rules
 * @returns {string | undefined}
 */
export function fmtPlural(count, rules) {
  return rules[plurals.select(count || 0)] || rules.other
}
