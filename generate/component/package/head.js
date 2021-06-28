import {h} from 'hastscript'
import {description} from '../../atom/micro/description.js'
import {downloads} from '../../atom/micro/downloads.js'
import {gh} from '../../atom/micro/gh.js'
import {graph} from '../../atom/micro/graph.js'
import {gzip} from '../../atom/micro/gzip.js'
import {license} from '../../atom/micro/license.js'
import {npm} from '../../atom/micro/npm.js'
import {score} from '../../atom/micro/score.js'
import {stars} from '../../atom/micro/stars.js'
import {verified} from '../../atom/micro/verified.js'
import {listSmall} from '../keyword/list-small.js'
import {helperFilter} from '../keyword/helper-filter.js'
import {helperSort} from '../keyword/helper-sort.js'

export function head(data, id) {
  var {projectByRepo, packageByName} = data
  var d = packageByName[id]
  var project = projectByRepo[d.repo]
  var [owner, projectName] = d.repo.split('/')
  var [scope, pkgName] = id.split('/')

  if (!pkgName) {
    pkgName = scope
    scope = null
  }

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
          h('a', {href: '/explore/package/' + id}, pkgName),
          d.latest
            ? [h('span.lowlight.separator', '@'), h('span.medlight', d.latest)]
            : ''
        ])
      ]),
      h('ol.flex.column.ellipsis-l', [
        graph(d.dependents, id),
        description(d.description, d.descriptionRich)
      ]),
      h('.column', [
        h('ol.row.justify-end-l', [
          score(d.score),
          verified(d.repo),
          license(d.license),
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
