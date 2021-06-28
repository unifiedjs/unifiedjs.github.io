import {constantLocale} from './constant-locale.js'

const plurals = new Intl.PluralRules(constantLocale)

export function fmtPlural(count, rules) {
  return rules[plurals.select(count || 0)] || rules.other
}
