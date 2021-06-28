import humanizeUrl from 'humanize-url'

export function fmtUrl(value) {
  return humanizeUrl(value || '')
}
