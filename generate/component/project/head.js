import h from 'hastscript'
import {description} from '../../atom/micro/description.js'
import {downloads} from '../../atom/micro/downloads.js'
import {gh} from '../../atom/micro/gh.js'
import {license} from '../../atom/micro/license.js'
import {score} from '../../atom/micro/score.js'
import {stars} from '../../atom/micro/stars.js'
import {url} from '../../atom/micro/url.js'
import {verified} from '../../atom/micro/verified.js'
import {listSmall} from '../topic/list-small.js'
import {helperFilter} from '../topic/helper-filter.js'
import {helperSort} from '../topic/helper-sort.js'
import {helperReduceDownloads} from './helper-reduce-downloads.js'
import {helperReduceLicense} from './helper-reduce-license.js'
import {helperReduceScore} from './helper-reduce-score.js'

export function head(data, repo) {
  var d = data.projectByRepo[repo]
  var [owner, name] = repo.split('/')

  return [
    h('.row-l.column-nl', [
      h(
        '.column',
        h('h2.content', [
          h('span.x-hide-l.medlight.label', 'Project: '),
          h('a', {href: '/explore/project/' + owner}, owner),
          h('span.lowlight.separator', '/'),
          h('a', {href: '/explore/project/' + repo}, name)
        ])
      ),
      h('ol.flex.column.ellipsis-l', [
        url(d.url),
        description(d.description, d.descriptionRich)
      ]),
      h('.column', [
        h('ol.row.justify-end-l', [
          score(helperReduceScore(data, repo)),
          verified(repo),
          license(helperReduceLicense(data, repo)),
          stars(d.stars, repo),
          gh(repo)
        ]),
        h('ol.row.justify-end-l', [
          downloads(helperReduceDownloads(data, repo))
        ])
      ])
    ]),
    listSmall(data, helperFilter(data, helperSort(data, d.topics)))
  ]
}
