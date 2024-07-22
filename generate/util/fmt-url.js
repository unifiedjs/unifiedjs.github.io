import humanizeUrl from 'humanize-url'

/**
 * @param {string | undefined} value
 * @returns {string}
 */
export function fmtUrl(value) {
  return humanizeUrl(value || '')
}
