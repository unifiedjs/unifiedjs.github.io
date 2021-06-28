import {constantLocale} from './constant-locale.js'

export function fmtPercent(value) {
  return (value || 0).toLocaleString(constantLocale, {style: 'percent'})
}
