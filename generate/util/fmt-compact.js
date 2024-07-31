import {constantLocale} from './constant-locale.js'

/**
 * @param {number | undefined} value
 * @returns {string}
 */
export function fmtCompact(value) {
  return (value || 0)
    .toLocaleString(constantLocale, {notation: 'compact'})
    .toLowerCase()
}
