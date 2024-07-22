/**
 * @import {ElementContent} from 'hast'
 */

import {h} from 'hastscript'
import {constantCollective} from '../../util/constant-collective.js'
import {verified as icon} from '../icon/verified.js'

/**
 * @param {string} name
 * @returns {Array<ElementContent> | ElementContent}
 */
export function verified(name) {
  return constantCollective.includes(name.split('/')[0])
    ? h('li', {}, icon())
    : []
}
