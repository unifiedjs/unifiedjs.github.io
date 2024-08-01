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
import {glob} from 'glob'
import {read, write} from 'to-vfile'
import {matter} from 'vfile-matter'
import {reporter} from 'vfile-reporter'
import {VFile} from 'vfile'
import yaml from 'yaml'
import {humans} from '../data/humans.js'
import {releases as dataReleases} from '../data/releases.js'
import {sponsors} from '../data/sponsors.js'
import {teams} from '../data/teams.js'
import {article as articlePipeline} from './pipeline/article.js'
import {description as descriptionPipeline} from './pipeline/description.js'
import {main as pipeline} from './pipeline/main.js'
import {readme as readmePipeline} from './pipeline/readme.js'
import {release as createReleasePipeline} from './pipeline/release.js'
import {articles} from './page/articles.js'
import {article} from './page/article.js'
import {cases} from './page/cases.js'
import {community} from './page/community.js'
import {explore} from './page/explore.js'
import {home} from './page/home.js'
import {keywords} from './page/keywords.js'
import {keyword} from './page/keyword.js'
import {learn} from './page/learn.js'
import {members} from './page/members.js'
import {owner} from './page/owner.js'
import {packages} from './page/packages.js'
import {renderPackage} from './page/package.js'
import {projects} from './page/projects.js'
import {project} from './page/project.js'
import {releases} from './page/releases.js'
import {scope} from './page/scope.js'
import {sponsor} from './page/sponsors.js'
import {topics} from './page/topics.js'
import {topic} from './page/topic.js'
import {data} from './data.js'

const users = /** @type {Array<ShowcaseUser>} */ (
  yaml.parse(
    await fs.readFile(new URL('../doc/showcase.yml', import.meta.url), 'utf8')
  )
)

/** @type {Array<() => Page | Promise<Page>>} */
const tasks = []

// Render descriptions
await expandDescription(data.projectByRepo)
await expandDescription(data.packageByName)
await expandReleases(dataReleases)

const input = await glob('doc/learn/**/*.md')
/** @type {Array<VFile>} */
const entries = []

for (const d of input) {
  const file = await read(d)

  matter(file)
  const slug = file.stem
  assert(slug)
  let meta = file.data.meta

  if (!meta) {
    meta = {}
    file.data.meta = meta
  }

  assert(file.data.matter)
  const {group, tags} = file.data.matter
  assert(typeof group === 'string')
  meta.type = 'article'
  meta.tags = [group]
  if (tags) meta.tags.push(...tags)
  meta.pathname = ['', 'learn', group, slug, ''].join('/')

  entries.push(file)
}

const minidata = [
  {
    description:
      'Learn unified through articles, each telling a story, that walks through how to complete a certain task',
    slug: 'guide',
    title: 'Guides'
  },
  {
    description:
      'Learn unified through byte-sized articles, that stand on their own, explaining how to complete a small, specific, focussed task',
    slug: 'recipe',
    title: 'Recipes'
  }
]

/** @type {Array<Metadata>} */
const sections = []

for (const d of minidata) {
  const {slug} = d
  /** @type {Array<VFile>} */
  const groupEntries = []

  for (const d of entries) {
    if (d.data.matter && d.data.matter.group === slug) {
      groupEntries.push(d)
    }
  }

  sections.push({
    ...d,
    entries: groupEntries,
    pathname: '/learn/' + slug + '/',
    tags: [slug, 'learn']
  })
}

page(
  function () {
    return home({...data, articles: entries, humans, sponsors, teams, users})
  },
  {
    description:
      'Content as structured data: unified compiles content and provides hundreds of packages to work with content',
    pathname: '/'
  }
)

for (const file of entries) {
  tasks.push(async function () {
    const inputTree = articlePipeline.parse(file)
    const outputTree = await articlePipeline.run(inputTree, file)

    return {file, tree: article(outputTree, file)}
  })
}

for (const section of sections) {
  const {description, entries, pathname, tags, title} = section
  const meta = {description, pathname, tags, title}
  assert(entries)
  page(function () {
    return articles(meta, entries)
  }, meta)
}

page(
  function () {
    return learn(sections)
  },
  {
    description: 'Learn unified through guides and recipes',
    pathname: '/learn/',
    tags: ['learn', 'recipe', 'guide', 'tutorial'],
    title: 'Learn'
  }
)

page(
  function () {
    return explore(data)
  },
  {
    description: 'Explore the unified ecosystem',
    pathname: '/explore/',
    title: 'Explore'
  }
)

page(
  function () {
    return keywords(data)
  },
  {
    description: 'Explore packages in the unified ecosystem by keyword',
    pathname: '/explore/keyword/',
    title: 'Keywords - Explore'
  }
)

for (const d of Object.keys(data.packagesByKeyword)) {
  page(
    function () {
      return keyword(data, d)
    },
    {
      description:
        'Explore packages in the unified ecosystem with the “' +
        d +
        '” keyword',
      pathname: '/explore/keyword/' + d + '/',
      title: d + ' - Keywords'
    }
  )
}

for (const d of Object.keys(data.packagesByScope)) {
  page(
    function () {
      return scope(data, d)
    },
    {
      description:
        'Explore packages in the unified ecosystem in the “' + d + '” scope',
      pathname: '/explore/package/' + d + '/',
      title: d + ' - Scope'
    }
  )
}

page(
  function () {
    return topics(data)
  },
  {
    description: 'Explore projects in the unified ecosystem by topic',
    pathname: '/explore/topic/',
    title: 'Topics - Explore'
  }
)

for (const d of Object.keys(data.projectsByTopic)) {
  page(
    function () {
      return topic(data, d)
    },
    {
      description:
        'Explore projects in the unified ecosystem with the “' + d + '” topic',
      pathname: '/explore/topic/' + d + '/',
      title: d + ' - Topics'
    }
  )
}

for (const d of Object.keys(data.projectsByOwner)) {
  page(
    function () {
      return owner(data, d)
    },
    {
      description: 'Explore projects in the unified ecosystem by “@' + d + '”',
      pathname: '/explore/project/' + d + '/',
      title: '@' + d + ' - Owner'
    }
  )
}

page(
  function () {
    return packages(data)
  },
  {
    description: 'Explore all packages in the unified ecosystem',
    pathname: '/explore/package/',
    title: 'Packages - Explore'
  }
)

page(
  function () {
    return projects(data)
  },
  {
    description: 'Explore all projects in the unified ecosystem',
    pathname: '/explore/project/',
    title: 'Projects - Explore'
  }
)

page(
  function () {
    return releases(data)
  },
  {
    description: 'Explore recent releases in the unified ecosystem',
    pathname: '/explore/release/',
    title: 'Releases - Explore'
  }
)

for (const [d, p] of Object.entries(data.projectByRepo)) {
  const {description, topics} = p

  page(
    function () {
      return project(data, d)
    },
    {
      description,
      pathname: '/explore/project/' + d + '/',
      tags: [...topics],
      title: d
    }
  )
}

for (const [d, pack] of Object.entries(data.packageByName)) {
  const {description, keywords, manifestBase, readmeName, repo} = pack
  const input = new URL('../data/readme/' + readmeName, import.meta.url)
  const pathname = '/explore/package/' + d + '/'

  tasks.push(async function () {
    const file = await read(input)
    const meta = {description, pathname, tags: keywords, title: d}

    file.data = {meta, repo}
    const inputTree = readmePipeline.parse(file)
    const outputTree = await readmePipeline.run(inputTree, file)

    return {file, tree: renderPackage(data, d, outputTree)}
  })
}

page(
  function () {
    return community({humans, sponsors, teams, users})
  },
  {
    description: 'Get involved, meet the team, and support us',
    pathname: '/community/',
    title: 'Community'
  }
)

page(
  function () {
    return members({humans, sponsors, teams, users})
  },
  {
    description: 'Meet the team maintaining unified',
    pathname: '/community/member/',
    title: 'Team - Community'
  }
)

page(
  function () {
    return sponsor(sponsors)
  },
  {
    description: 'Support unified by becoming a sponsor',
    pathname: '/community/sponsor/',
    title: 'Sponsor - Community'
  }
)

page(
  function () {
    return cases(users)
  },
  {
    description: 'Showcase of interesting use cases of unified',
    pathname: '/community/case/',
    title: 'Showcase - Community'
  }
)

for (const render of tasks) {
  const {tree, file} = await render()
  file.value = pipeline.stringify(await pipeline.run(tree, file), file)
  await write(file)
  console.log(reporter(file))
}

/**
 *
 * @param {() => Root} render
 * @param {DataMap['meta']} meta
 * @returns {undefined}
 */
function page(render, meta) {
  tasks.push(function () {
    return {file: new VFile({data: {meta}}), tree: render()}
  })
}

/**
 * @template {{description?: string, descriptionRich?: Root}} T
 * @param {Record<string, T>} map
 * @returns {Promise<undefined>}
 */
async function expandDescription(map) {
  for (const d of Object.values(map)) {
    const tree = descriptionPipeline.parse(d.description)
    d.descriptionRich = await descriptionPipeline.run(tree)
  }
}

/**
 * @param {ReadonlyArray<Release>} releases
 * @returns {Promise<undefined>}
 */
async function expandReleases(releases) {
  for (const d of releases) {
    const pipeline = createReleasePipeline(d)
    d.descriptionRich = await pipeline.run(pipeline.parse(d.description))
  }
}
