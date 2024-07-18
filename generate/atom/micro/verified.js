import {h} from 'hastscript'
import {constantCollective} from '../../util/constant-collective.js'
import {verified as icon} from '../icon/verified.js'

export function verified(name) {
  return constantCollective.includes(name.split('/')[0])
    ? h('li', {}, icon())
    : ''
}
