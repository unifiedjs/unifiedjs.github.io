// @ts-expect-error - untyped.
import numberAbbreviate from 'number-abbreviate'

// To do: switch?
// Would like to use: `.toLocaleString(locale, {notation: 'compact'})`,
// but that’s not widely supported yet.
/**
 * @param {number | undefined} value
 * @returns {string}
 */
export function fmtCompact(value) {
  return String(numberAbbreviate(value || 0))
}
