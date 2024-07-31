/**
 * @import {Root} from 'hast'
 * @import {DataMap} from 'vfile'
 * @import {Human} from '../data/humans.js'
 * @import {Release} from '../data/releases.js'
 * @import {Person as Sponsor} from '../data/sponsors.js'
 * @import {Team} from '../data/teams.js'
 * @import {Metadata} from './component/article/list.js'
 *
 * @typedef CommunityData
 * @property {ReadonlyArray<Human>} humans
 * @property {ReadonlyArray<Sponsor>} sponsors
 * @property {ReadonlyArray<Team>} teams
 * @property {ReadonlyArray<ShowcaseUser>} users
 *
 * @typedef Page
 * @property {VFile} file
 * @property {Root} tree
 *
 * @typedef ShowcaseUser
 * @property {string} gh
 * @property {string} short
 * @property {string} src
 * @property {string} title
 * @property {string} url
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import yaml from 'yaml'
import {glob} from 'glob'
import {matter} from 'vfile-matter'
import all from 'p-all'
import {read, write} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {VFile} from 'vfile'
import {humans} from '../data/humans.js'
import {releases as dataReleases} from '../data/releases.js'
import {sponsors} from '../data/sponsors.js'
import {teams} from '../data/teams.js'
import {data} from './data.js'
import {main as pipeline} from './pipeline/main.js'
import {article as articlePipeline} from './pipeline/article.js'
import {readme as readmePipeline} from './pipeline/readme.js'
import {description as descriptionPipeline} from './pipeline/description.js'
import {release as createReleasePipeline} from './pipeline/release.js'
import {article} from './page/article.js'
import {articles} from './page/articles.js'
import {cases} from './page/cases.js'
import {community} from './page/community.js'
import {explore} from './page/explore.js'
import {home} from './page/home.js'
import {keyword} from './page/keyword.js'
import {keywords} from './page/keywords.js'
import {learn} from './page/learn.js'
import {members} from './page/members.js'
import {owner} from './page/owner.js'
import {renderPackage} from './page/package.js'
import {packages} from './page/packages.js'
import {project} from './page/project.js'
import {projects} from './page/projects.js'
import {releases} from './page/releases.js'
import {scope} from './page/scope.js'
import {sponsor} from './page/sponsors.js'
import {topic} from './page/topic.js'
import {topics} from './page/topics.js'

const users = /** @type {Array<ShowcaseUser>} */ (
  yaml.parse(await fs.readFile(path.join('doc', 'showcase.yml'), 'utf8'))
)

/** @type {Array<() => Promise<Page> | Page>} */
const tasks = []

// Render descriptions
expandDescription(data.projectByRepo)
expandDescription(data.packageByName)
await expandReleases(dataReleases)

const input = await glob('doc/learn/**/*.md')

const entries = await Promise.all(
  input.map(async function (input) {
    const file = await read(input)
    matter(file)
    const slug = path.basename(input, path.extname(input))
    let meta = file.data.meta

    if (!meta) {
      meta = {}
      file.data.meta = meta
    }

    assert(file.data.matter)
    const {group, tags} = file.data.matter || {}
    assert(typeof group === 'string')
    meta.type = 'article'
    meta.tags = [group]
    if (tags) meta.tags.push(...tags)
    meta.pathname = ['', 'learn', group, slug, ''].join('/')

    return file
  })
)

const sections = [
  {
    slug: 'guide',
    title: 'Guides',
    description:
      'Learn unified through articles, each telling a story, that walks through how to complete a certain task'
  },
  {
    slug: 'recipe',
    title: 'Recipes',
    description:
      'Learn unified through byte-sized articles, that stand on their own, explaining how to complete a small, specific, focussed task'
  }
].map(function (d) {
  const {slug} = d
  /** @type {Metadata} */
  const result = {
    ...d,
    tags: [slug, 'learn'],
    pathname: '/learn/' + slug + '/',
    entries: entries.filter((d) => {
      return d.data.matter && d.data.matter.group === slug
    })
  }
  return result
})

page(() => home({...data, articles: entries, humans, sponsors, teams, users}), {
  description:
    'Content as structured data: unified compiles content and provides hundreds of packages to work with content',
  pathname: '/'
})

for (const file of entries) {
  tasks.push(() =>
    articlePipeline
      .run(articlePipeline.parse(file), file)
      .then((tree) => ({tree: article(tree, file), file}))
  )
}

for (const section of sections) {
  const {title, description, tags, pathname, entries} = section
  const meta = {title, description, tags, pathname}
  assert(entries)
  page(() => articles(meta, entries), meta)
}

page(() => learn(sections), {
  title: 'Learn',
  tags: ['learn', 'recipe', 'guide', 'tutorial'],
  description: 'Learn unified through guides and recipes',
  pathname: '/learn/'
})

page(() => explore(data), {
  title: 'Explore',
  description: 'Explore the unified ecosystem',
  pathname: '/explore/'
})

page(() => keywords(data), {
  title: 'Keywords - Explore',
  description: 'Explore packages in the unified ecosystem by keyword',
  pathname: '/explore/keyword/'
})

for (const d of Object.keys(data.packagesByKeyword)) {
  page(() => keyword(data, d), {
    title: d + ' - Keywords',
    description:
      'Explore packages in the unified ecosystem with the “' + d + '” keyword',
    pathname: '/explore/keyword/' + d + '/'
  })
}

for (const d of Object.keys(data.packagesByScope)) {
  page(() => scope(data, d), {
    title: d + ' - Scope',
    description:
      'Explore packages in the unified ecosystem in the “' + d + '” scope',
    pathname: '/explore/package/' + d + '/'
  })
}

page(() => topics(data), {
  title: 'Topics - Explore',
  description: 'Explore projects in the unified ecosystem by topic',
  pathname: '/explore/topic/'
})

for (const d of Object.keys(data.projectsByTopic)) {
  page(() => topic(data, d), {
    title: d + ' - Topics',
    description:
      'Explore projects in the unified ecosystem with the “' + d + '” topic',
    pathname: '/explore/topic/' + d + '/'
  })
}

for (const d of Object.keys(data.projectsByOwner)) {
  page(() => owner(data, d), {
    title: '@' + d + ' - Owner',
    description: 'Explore projects in the unified ecosystem by “@' + d + '”',
    pathname: '/explore/project/' + d + '/'
  })
}

page(() => packages(data), {
  title: 'Packages - Explore',
  description: 'Explore all packages in the unified ecosystem',
  pathname: '/explore/package/'
})

page(() => projects(data), {
  title: 'Projects - Explore',
  description: 'Explore all projects in the unified ecosystem',
  pathname: '/explore/project/'
})

page(() => releases(data), {
  title: 'Releases - Explore',
  description: 'Explore recent releases in the unified ecosystem',
  pathname: '/explore/release/'
})

for (const [d, p] of Object.entries(data.projectByRepo)) {
  const {description, topics} = p

  page(() => project(data, d), {
    title: d,
    description,
    tags: [...topics],
    pathname: '/explore/project/' + d + '/'
  })
}

for (const [d, pack] of Object.entries(data.packageByName)) {
  const {description, readmeName, repo, manifestBase, keywords} = pack
  const input = path.join('data', 'readme', readmeName)
  const pathname = '/explore/package/' + d + '/'

  tasks.push(() =>
    read(input).then((file) => {
      const meta = {title: d, description, pathname, tags: keywords}

      file.data = {meta, repo, dirname: manifestBase}

      return readmePipeline
        .run(readmePipeline.parse(file), file)
        .then((tree) => ({tree: renderPackage(data, d, tree), file}))
    })
  )
}

page(() => community({teams, humans, sponsors, users}), {
  title: 'Community',
  description: 'Get involved, meet the team, and support us',
  pathname: '/community/'
})

page(() => members({teams, humans, sponsors, users}), {
  title: 'Team - Community',
  description: 'Meet the team maintaining unified',
  pathname: '/community/member/'
})

page(() => sponsor(sponsors), {
  title: 'Sponsor - Community',
  description: 'Support unified by becoming a sponsor',
  pathname: '/community/sponsor/'
})

page(() => cases(users), {
  title: 'Showcase - Community',
  description: 'Showcase of interesting use cases of unified',
  pathname: '/community/case/'
})

const promises = tasks.map((render) => () => {
  return Promise.resolve(render())
    .then(({tree, file}) =>
      pipeline.run(tree, file).then((tree) => ({tree, file}))
    )
    .then(({tree, file}) => {
      file.value = pipeline.stringify(tree, file)
      return file
    })
    .then((file) => write(file).then(() => file))
    .then(
      function (x) {
        console.log(reporter(x))
      },
      /**
       * @param {unknown} error
       */
      function (error) {
        console.error(error)
      }
    )
})

all(promises, {concurrency: 50})

/**
 *
 * @param {() => Root} render
 * @param {DataMap['meta']} meta
 * @returns {undefined}
 */
function page(render, meta) {
  tasks.push(function () {
    return {tree: render(), file: new VFile({data: {meta}})}
  })
}

/**
 * @template {{description?: string, descriptionRich?: Root}} T
 * @param {Record<string, T>} map
 * @returns {undefined}
 */
function expandDescription(map) {
  for (const d of Object.values(map)) {
    const tree = descriptionPipeline.parse(d.description)
    d.descriptionRich = descriptionPipeline.runSync(tree)
  }
}

/**
 * @param {ReadonlyArray<Release>} releases
 * @returns {Promise<undefined>}
 */
async function expandReleases(releases) {
  await Promise.all(
    releases.map(async (d) => {
      const pipeline = createReleasePipeline(d)
      const tree = pipeline.parse(d.description)
      d.descriptionRich = await pipeline.run(tree)
    })
  )
}
