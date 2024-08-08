/**
 * @import {Root} from 'hast'
 * @import {DataMap} from 'vfile'
 * @import {Entry as FeedEntry} from 'xast-util-feed'
 * @import {Entry as SitemapEntry} from 'xast-util-sitemap'
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
import {fromHtml} from 'hast-util-from-html'
import {isElement} from 'hast-util-is-element'
import {sanitize} from 'hast-util-sanitize'
import {select} from 'hast-util-select'
import {toHtml} from 'hast-util-to-html'
import {urlAttributes} from 'html-url-attributes'
import {read, write} from 'to-vfile'
import {visit} from 'unist-util-visit'
import {matter} from 'vfile-matter'
import {reporter} from 'vfile-reporter'
import {VFile} from 'vfile'
import {rss} from 'xast-util-feed'
import {sitemap} from 'xast-util-sitemap'
import {toXml} from 'xast-util-to-xml'
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

const origin = 'https://unifiedjs.com'

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
  meta.origin = origin
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
    origin,
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
    origin,
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
  const meta = {
    description,
    origin,
    pathname,
    tags,
    title
  }
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
    origin,
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
    origin,
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
    origin,
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
      origin,
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
      origin,
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
    origin,
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
      origin,
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
      origin,
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
    origin,
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
    origin,
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
    origin,
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
      origin,
      pathname: '/explore/project/' + d + '/',
      tags: [...topics],
      title: d
    }
  )
}

for (const [d, pack] of Object.entries(data.packageByName)) {
  const {description, keywords, readmeName, repo} = pack
  const input = new URL('../data/readme/' + readmeName, import.meta.url)
  const pathname = '/explore/package/' + d + '/'

  tasks.push(async function () {
    const file = await read(input)
    const meta = {description, origin, pathname, tags: keywords, title: d}

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
    origin,
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
    origin,
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
    origin,
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
    origin,
    pathname: '/community/case/',
    title: 'Showcase - Community'
  }
)

/** @type {Array<SitemapEntry>} */
const sitemapEntries = []
/** @type {Array<VFile>} */
const learnFiles = []

for (const render of tasks) {
  const {tree, file} = await render()
  file.value = pipeline.stringify(await pipeline.run(tree, file), file)
  await write(file)
  console.error(reporter(file))
  const meta = file.data.meta || {}
  const matter = file.data.matter || {}
  const pathname = matter.pathname || meta.pathname
  const modified = matter.modified || meta.modified
  assert(pathname)
  sitemapEntries.push({url: new URL(pathname, origin).href, modified})

  if (matter.group) {
    learnFiles.push(file)
  }
}

await fs.writeFile(
  new URL('../build/CNAME', import.meta.url),
  new URL(origin).host + '\n'
)

console.error('✔ `/CNAME`')

await fs.writeFile(
  new URL('../build/robots.txt', import.meta.url),
  [
    'User-agent: *',
    'Allow: /',
    'Sitemap: ' + new URL('sitemap.xml', origin).href,
    ''
  ].join('\n')
)

console.error('✔ `/robots.txt`')

await fs.writeFile(
  new URL('../build/sitemap.xml', import.meta.url),
  toXml(sitemap(sitemapEntries))
)

console.error('✔ `/sitemap.xml`')

learnFiles.sort(function (a, b) {
  assert(a.data.matter?.published)
  assert(b.data.matter?.published)
  return (
    new Date(b.data.matter.published).valueOf() -
    new Date(a.data.matter.published).valueOf()
  )
})

const newestLearnFiles = learnFiles.slice(0, 10)
/** @type {Array<FeedEntry>} */
const learnEntries = []

for (const file of newestLearnFiles) {
  const tree = fromHtml(file.value)
  const body = select('main', tree)
  assert(body)
  const fragment = sanitize(body)

  const {matter, meta} = file.data
  assert(matter)
  assert(meta)
  assert(meta.pathname)
  const base = new URL(meta.pathname, origin)

  visit(fragment, 'element', function (node, index, parent) {
    // Make URLs absolute.
    for (const property in node.properties) {
      if (
        Object.hasOwn(urlAttributes, property) &&
        isElement(node, urlAttributes[property]) &&
        node.properties[property] !== null &&
        node.properties[property] !== undefined
      ) {
        node.properties[property] = new URL(
          String(node.properties[property]),
          base
        ).href
      }
    }

    if (parent && typeof index === 'number') {
      // Drop empty spans, left from syntax highlighting.
      if (
        node.tagName === 'span' &&
        Object.keys(node.properties).length === 0
      ) {
        parent.children.splice(index, 1, ...node.children)
        return index
      }

      // Drop tooltips from twoslash.
      if (
        node.tagName === 'div' &&
        typeof node.properties.id === 'string' &&
        node.properties.id.startsWith('user-content-rehype-twoslash')
      ) {
        parent.children.splice(index, 1)
        return index
      }
    }
  })

  learnEntries.push({
    author: matter.author,
    descriptionHtml: toHtml(fragment),
    description: matter.description,
    modified: matter.modified,
    published: matter.published,
    title: matter.title,
    url: base.href
  })
}

await fs.writeFile(
  new URL('../build/rss.xml', import.meta.url),
  toXml(
    rss(
      {
        feedUrl: new URL('rss.xml', origin).href,
        lang: 'en',
        title: 'unified - learn',
        url: origin
      },
      learnEntries
    )
  ) + '\n'
)

console.error('✔ `/rss.xml`')

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
