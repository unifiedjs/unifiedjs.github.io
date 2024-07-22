import {constantLocale} from './constant-locale.js'

/**
 * @param {number | undefined} value
 * @returns {string}
 */
export function fmtPercent(value) {
  return (value || 0).toLocaleString(constantLocale, {style: 'percent'})
}
