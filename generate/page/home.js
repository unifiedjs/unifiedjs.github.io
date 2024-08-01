/**
 * @import {Root} from 'hast'
 * @import {VFile} from 'vfile'
 * @import {Data} from '../data.js'
 * @import {CommunityData} from '../index.js'
 */

import {h} from 'hastscript'
import {block} from '../atom/macro/block.js'
import {helperSort as articlesSort} from '../component/article/helper-sort.js'
import {list as articlesList} from '../component/article/list.js'
import {list as cases} from '../component/case/list.js'
import {helperSort as sortPackage} from '../component/package/helper-sort.js'
import {list as listPackage} from '../component/package/list.js'
import {explorePreview as release} from '../component/release/explore-preview.js'
import {helperFilter as releaseFilter} from '../component/release/helper-filter.js'
import {list as sponsors} from '../component/sponsor/list.js'
import {meta} from '../../data/meta.js'
import {releases as dataReleases} from '../../data/releases.js'
import {constantCollective} from '../util/constant-collective.js'
import {fmtCompact} from '../util/fmt-compact.js'
import {fmtPercent} from '../util/fmt-percent.js'
import {pickRandom} from '../util/pick-random.js'
import {page} from './page.js'

const linux = 3_166_218 // Checked from the `diskUsage` result for `torvalds/linux`
// on GHs GraphQL API.
const mobyDick = 1.2 * 1024 * 1024
// Apparently Gutenberg’s version is 1.2mb.

/**
 * @param {CommunityData & Data & {articles: ReadonlyArray<VFile>}} data
 * @returns {Root}
 */
export function home(data) {
  const {packageByName, projectByRepo} = data
  const names = sortPackage(data, Object.keys(packageByName))
  const repos = Object.keys(projectByRepo)
  const d = pickRandom(names.slice(0, 75), 5)
  const closed = meta.issueClosed + meta.prClosed
  const open = meta.issueOpen + meta.prOpen
  const applicableReleases = releaseFilter(
    data,
    dataReleases,
    30 * 24 * 60 * 60 * 1000
  )
  let downloads = 0
  let stars = 0
  let releases = 0

  for (const d of names) {
    downloads += packageByName[d].downloads || 0
  }

  for (const d of repos) {
    stars += projectByRepo[d].stars || 0
  }

  for (const d of applicableReleases) {
    if (constantCollective.includes(d.repo.split('/')[0])) {
      releases++
    }
  }

  return page(
    [
      h('.landing', [
        h('.article', [
          h('h2', 'Content as structured data'),
          h('p', [
            'We compile content to syntax trees and syntax trees to content. ',
            h('br'),
            'We ',
            h('em', 'also'),
            ' provide hundreds of packages to work on the trees in ',
            'between. ',
            h('br'),
            h('strong', 'You'),
            ' can build on the ',
            h('strong', 'unified collective'),
            ' to make all kinds of interesting things. '
          ])
        ])
      ])
    ],
    [
      h('.article.content', [
        h('h2', 'Build'),
        h('p', [
          h('b', 'We provide the building blocks'),
          ': from tiny, focussed, modular utilities to plugins that combine ',
          'them to perform bigger tasks. ',
          'And much, much more. ',
          'You can build on unified, mixing and matching building blocks ',
          'together, to make all kinds of interesting new things. '
        ])
      ]),
      cases(data.users, {max: 6}),
      h('.article.content', [
        h('h2', 'Learn'),
        h('p', [
          h('b', 'We provide the interface'),
          ': for parsing, inspecting, transforming, and serializing content. ',
          'You work on structured data. ',
          'Learn how to plug building blocks together, write your own, and ',
          'make things with unified. '
        ])
      ]),
      articlesList({pathname: '/learn/'}, articlesSort(data.articles), {
        max: 6
      }),
      h('.article.content', [
        h('h2', 'Explore'),
        h('p', [
          'The ever growing ecosystem that the unified collective provides ',
          'today consists of ' + repos.length + ' open source projects, ',
          'with a combined ',
          h('strong', fmtCompact(stars)),
          ' stars on GitHub. ',
          'In comparison, the code that the collective maintains is about ',
          String(Math.floor(meta.size / mobyDick)),
          ' Moby Dicks or ',
          String(Math.floor(meta.size / linux)),
          ' Linuxes. ',
          'In the last 30 days, the ' + names.length + ' packages maintained ',
          'in those projects were downloaded ',
          h('strong', fmtCompact(downloads)),
          ' times from npm. ',
          'Much of this is maintained by our teams, yet others are provided ',
          'by the community. '
        ])
      ]),
      listPackage(data, d, {trail: explore()}),
      h('.article.content', [
        h('h2', 'Work'),
        h('p', [
          'Maintaining the collective, developing new projects, keeping ',
          'everything fast and secure, and helping users, is a lot of work. ',
          'In total, we’ve closed ',
          fmtCompact(closed),
          ' issues/PRs while ',
          fmtCompact(open),
          ' are currently open (',
          fmtPercent(open / (open + closed)),
          '). ',
          'In the last 30 days, we’ve cut ' + releases + ' new releases.'
        ])
      ]),
      release(data),
      h('.article.content', [
        h('h2', 'Sponsor'),
        h('p', [
          'Thankfully, we are backed financially by our sponsors. ',
          'This allows us to spend more time maintaining our projects and ',
          'developing new ones. ',
          'To support our efforts financially, sponsor or back us on ',
          h('a', {href: 'http://opencollective.com/unified'}, 'OpenCollective'),
          '.'
        ])
      ]),
      sponsors(data.sponsors, {max: 6})
    ]
  )

  function explore() {
    return block(
      h(
        'a.box.more',
        {href: '/explore/'},
        h('.column', [
          h(
            'p',
            'See ' +
              names.length +
              ' packages and ' +
              repos.length +
              ' projects'
          )
        ])
      )
    )
  }
}
