/**
 * @import {ElementContent} from 'hast'
 * @import {Data} from '../../data.js'
 */

import {tag} from '../../atom/micro/tag.js'

/**
 * @param {Data} data
 * @param {string} d
 * @returns {ElementContent}
 */
export function itemSmall(data, d) {
  const {projectsByTopic} = data

  return tag(d, (projectsByTopic[d] || []).length, '/explore/topic/' + d + '/')
}
