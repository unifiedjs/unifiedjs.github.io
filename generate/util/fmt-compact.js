import {constantLocale} from './constant-locale.js'

// To do: switch?
// Would like to use: `.toLocaleString(locale, {notation: 'compact'})`,
// but that’s not widely supported yet.
/**
 * @param {number | undefined} value
 * @returns {string}
 */
export function fmtCompact(value) {
  return (value || 0)
    .toLocaleString(constantLocale, {notation: 'compact'})
    .toLowerCase()
}
