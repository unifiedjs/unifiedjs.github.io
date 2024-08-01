/**
 * @import {ElementContent} from 'hast'
 * @import {Data} from '../../data.js'
 */

import {h} from 'hastscript'
import {item as box} from '../../atom/box/item.js'
import {downloads} from '../../atom/micro/downloads.js'
import {score} from '../../atom/micro/score.js'
import {stars} from '../../atom/micro/stars.js'
import {verified} from '../../atom/micro/verified.js'
import {helperReduceDownloads} from './helper-reduce-downloads.js'
import {helperReduceScore} from './helper-reduce-score.js'

/**
 * @param {Data} data
 * @param {string} name
 * @returns {ElementContent}
 */
export function item(data, name) {
  const {packagesByRepo, projectByRepo} = data
  const d = projectByRepo[name]
  const names = packagesByRepo[name]

  if (!names) {
    return h('p', 'Missing packages: ' + name)
  }

  const href =
    '/explore/' +
    (names.length > 1 ? 'project/' + name : 'package/' + names[0]) +
    '/'

  const value = d.descriptionRich ? d.descriptionRich.children : d.description

  return box(
    href,
    h('.column', [
      h('h4', {}, name),
      h('.content.double-ellipsis', {}, value),
      h('ol.row', [
        score(helperReduceScore(data, name)),
        verified(name),
        downloads(helperReduceDownloads(data, name)),
        stars(d.stars)
      ])
    ])
  )
}
