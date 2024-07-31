/**
 * @import {ElementContent} from 'hast'
 * @import {Data} from '../../data.js'
 */

import assert from 'node:assert/strict'
import {h} from 'hastscript'
import {description} from '../../atom/micro/description.js'
import {downloads} from '../../atom/micro/downloads.js'
import {gh} from '../../atom/micro/gh.js'
import {gzip} from '../../atom/micro/gzip.js'
import {license} from '../../atom/micro/license.js'
import {npm} from '../../atom/micro/npm.js'
import {score} from '../../atom/micro/score.js'
import {stars} from '../../atom/micro/stars.js'
import {verified} from '../../atom/micro/verified.js'
import {listSmall} from '../keyword/list-small.js'
import {helperFilter} from '../keyword/helper-filter.js'
import {helperSort} from '../keyword/helper-sort.js'

/**
 * @param {Data} data
 * @param {string} id
 * @returns {Array<ElementContent>}
 */
export function head(data, id) {
  const {projectByRepo, packageByName} = data
  const d = packageByName[id]
  const project = projectByRepo[d.repo]
  const [owner, projectName] = d.repo.split('/')
  let [scope, packageName] =
    /** @type {[scope: string | undefined, name: string | undefined]} */ (
      id.split('/')
    )

  if (!packageName) {
    packageName = scope
    scope = undefined
  }

  assert(packageName)

  return [
    h('.row-l.column-nl', [
      h('hgroup.column', [
        h('h2', [
          h('span.x-hide-l.medlight.label', 'Project: '),
          h('a', {href: '/explore/project/' + owner}, owner),
          h('span.lowlight.separator', '/'),
          h('a', {href: '/explore/project/' + d.repo}, projectName)
        ]),
        h('h3.content', [
          h('span.x-hide-l.medlight.label', 'Package: '),
          scope ? h('a', {href: '/explore/package/' + scope}, scope) : '',
          scope ? h('span.lowlight.separator', '/') : '',
          h('a', {href: '/explore/package/' + id}, packageName),
          d.latest
            ? [
                h('span.lowlight.separator', '@'),
                h('span.medlight', {}, d.latest)
              ]
            : ''
        ])
      ]),
      h('ol.flex.column.ellipsis-l', [
        description(d.description, d.descriptionRich)
      ]),
      h('.column', [
        h('ol.row.justify-end-l', [
          score(d.score),
          verified(d.repo),
          d.license ? license(d.license) : undefined,
          stars(project.stars, d.repo),
          gh(d.repo)
        ]),
        h('ol.row.justify-end-l', [
          gzip(d.gzip, id),
          downloads(d.downloads, id),
          npm(id)
        ])
      ])
    ]),
    listSmall(data, helperFilter(data, helperSort(data, d.keywords)))
  ]
}
