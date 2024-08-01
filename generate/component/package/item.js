/**
 * @import {ElementContent} from 'hast'
 * @import {Data} from '../../data.js'
 */

import {h} from 'hastscript'
import {downloads} from '../../atom/micro/downloads.js'
import {gzip} from '../../atom/micro/gzip.js'
import {score} from '../../atom/micro/score.js'
import {verified} from '../../atom/micro/verified.js'
import {item as box} from '../../atom/box/item.js'

/**
 * @param {Data} data
 * @param {string} name
 * @returns {ElementContent}
 */
export function item(data, name) {
  const {packageByName} = data
  const d = packageByName[name]
  const value = d.descriptionRich ? d.descriptionRich.children : d.description

  return box(
    '/explore/package/' + name + '/',
    h('.column', [
      h('h4', {}, name),
      h('.content.double-ellipsis', {}, value),
      h('ol.row', [
        score(d.score),
        verified(d.repo),
        downloads(d.downloads),
        gzip(d.gzip)
      ])
    ])
  )
}
