import prettyBytes from 'pretty-bytes'
import {constantLocale} from './constant-locale.js'

/**
 * @param {number | undefined} value
 * @returns {string}
 */
export function fmtBytes(value) {
  return prettyBytes(value || 0, {locale: constantLocale})
}
