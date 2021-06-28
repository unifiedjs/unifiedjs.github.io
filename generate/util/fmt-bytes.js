import prettyBytes from 'pretty-bytes'
import {constantLocale} from './constant-locale.js'

export function fmtBytes(value) {
  return prettyBytes(value || 0, {locale: constantLocale})
}
