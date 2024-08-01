/**
 * @import {Root} from 'hast'
 * @import {CommunityData} from '../index.js'
 */

import {h} from 'hastscript'
import {breadcrumbs} from '../molecule/breadcrumbs.js'
import {byline as casesByline} from '../component/case/byline.js'
import {list as cases} from '../component/case/list.js'
import {byline as membersByline} from '../component/member/byline.js'
import {helperSort as sortMembers} from '../component/member/helper-sort.js'
import {list as members} from '../component/member/list.js'
import {byline as sponsorsByline} from '../component/sponsor/byline.js'
import {list as sponsors} from '../component/sponsor/list.js'
import {page} from './page.js'

const twitter = 'https://twitter.com/unifiedjs'
const org = 'https://github.com/unifiedjs'
const base = org + '/.github/blob/HEAD/'
const coc = base + 'code-of-conduct.md'
const support = base + 'support.md'
const contributing = base + 'contributing.md'
const security = base + 'security.md'

/**
 * @param {CommunityData} data
 * @returns {Root}
 */
export function community(data) {
  return page(
    h('.row-l.column-l', {}, h('h2', {}, breadcrumbs('/community/'))),
    [
      h('.article.content', [h('h3', 'Showcase'), casesByline()]),
      cases(data.users, {max: 3}),
      h('.article.content', [h('h3', 'Team'), membersByline()]),
      members(data, sortMembers(data, data.humans), {max: 6}),
      h('.article.content', [h('h3', 'Sponsors'), sponsorsByline()]),
      sponsors(data.sponsors, {max: 6}),
      h('.article.content', [
        h('h3', 'Support'),
        h('p', [
          'There are a couple of places to get support when using unified that ',
          'are described in this section. ',
          'Before participating in unified’s communities, please read our ',
          h('a', {href: coc}, 'code of conduct'),
          '. ',
          'We expect that all community members adhere to the guidelines within.'
        ]),
        h('p', [
          'Questions can be asked on GitHub Discussions in each org. ',
          'Take a look at ',
          h('a', {href: support}, h('code', 'support.md')),
          ' to find out how to help us help you. ',
          'It’s important to spend enough time making your question clear yet ',
          'detailed, because generally speaking, if more time is spent on a ',
          'quality question, less time is needed to give a good answer.'
        ]),
        h('p', [
          'Issues can be raised on GitHub in one of the repositories under our ',
          'organizations. ',
          'See ',
          h('a', {href: contributing}, h('code', 'contributing.md')),
          ' to find out how to report problems. ',
          'This document also explains how improve documentation and ',
          'contribute to unified. '
        ]),
        h('p', [
          'Security issues can be reported by email and are handled through ',
          'security advisories on GitHub. ',
          'See ',
          h('a', {href: security}, h('code', 'security.md')),
          ' to find out how to submit a report. '
        ]),
        h('h3', 'Learn'),
        h('p', [
          'To learn about unified, browse our ',
          h('a', {href: '/learn/'}, 'Learn'),
          ' section. ',
          'This section includes several articles ranging from recipes that ',
          'complete small, specific tasks, to guides that walk through how ',
          'to complete bigger tasks. ',
          'Additionally, the readmes of our projects (available through the ',
          h('a', {href: '/explore/'}, 'Explore'),
          ' section, or on GitHub and npm), describe each project in detail.'
        ]),
        h('h3', 'News'),
        h('p', [
          'Follow the ',
          h('a', {href: twitter}, h('b', '@unifiedjs')),
          ' account on Twitter for news. ',
          'You can also tweet at this account with questions or suggestions, ',
          'or mention it when you made something with unified! '
        ]),
        h('p', [
          'See the ',
          h('a', {href: '/explore/release/'}, 'Releases'),
          ' section for recent releases.'
        ])
      ])
    ]
  )
}
