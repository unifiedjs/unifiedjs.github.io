import numberAbbreviate from 'number-abbreviate'

// Would like to use: `.toLocaleString(locale, {notation: 'compact'})`,
// but that’s not widely supported yet.
export function fmtCompact(value) {
  return String(numberAbbreviate(value || 0))
}
