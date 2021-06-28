import {h} from 'hastscript'
import {fmtPercent} from '../../util/fmt-percent.js'
import {scoreColor} from '../../util/score-color.js'
import {score as icon} from '../icon/score.js'

export function score(value) {
  return value
    ? h('li', {style: 'color:' + scoreColor(value)}, [
        icon(),
        ' ',
        fmtPercent(value)
      ])
    : ''
}
