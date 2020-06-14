'use strict'

var fs = require('fs')
var {join, basename, extname} = require('path')
var yaml = require('js-yaml')
var glob = require('glob')
var matter = require('vfile-matter')
var all = require('p-all')
var vfile = require('to-vfile')
var report = require('vfile-reporter')
var sponsors = require('../data/sponsors')
var humans = require('../data/humans')
var teams = require('../data/teams')
var data = require('./data')
var pipeline = require('./pipeline/main')
var articlePipeline = require('./pipeline/article')
var readmePipeline = require('./pipeline/readme')
var descriptionPipeline = require('./pipeline/description')
var article = require('./page/article')
var articles = require('./page/articles')
var cases = require('./page/cases')
var community = require('./page/community')
var explore = require('./page/explore')
var home = require('./page/home')
var keyword = require('./page/keyword')
var keywords = require('./page/keywords')
var learn = require('./page/learn')
var members = require('./page/members')
var owner = require('./page/owner')
var pkg = require('./page/package')
var packages = require('./page/packages')
var project = require('./page/project')
var projects = require('./page/projects')
var scope = require('./page/scope')
var sponsor = require('./page/sponsors')
var topic = require('./page/topic')
var topics = require('./page/topics')

var users = yaml.safeLoad(fs.readFileSync(join('doc', 'showcase.yml')))

var tasks = []

// Render descriptions
expandDescription(data.projectByRepo)
expandDescription(data.packageByName)

var entries = glob.sync('doc/learn/**/*.md').map((input) => {
  var file = matter(vfile.readSync(input))
  var slug = basename(input, extname(input))
  var {group, tags} = file.data.matter

  file.data.meta = {
    type: 'article',
    tags: [].concat(group || [], tags || []),
    pathname: ['', 'learn', group, slug, ''].join('/')
  }

  return file
})

var sections = [
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
].map((d) => {
  var {slug} = d
  return {
    ...d,
    tags: [slug, 'learn'],
    pathname: '/learn/' + slug + '/',
    entries: entries.filter((d) => d.data.matter.group === slug)
  }
})

page(() => home({...data, articles: entries, sponsors, users}), {
  description:
    'Content as structured data: unified compiles content and provides hundreds of packages to work with content',
  pathname: '/'
})

entries.forEach((file) => {
  tasks.push(() =>
    articlePipeline
      .run(articlePipeline.parse(file), file)
      .then((tree) => ({tree: article(tree, file), file}))
  )
})

sections.forEach((section) => {
  var {title, description, tags, pathname, entries} = section
  var meta = {title, description, tags, pathname}
  page(() => articles(meta, entries), meta)
})

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

Object.keys(data.packagesByKeyword).forEach((d) => {
  page(() => keyword(data, d), {
    title: d + ' - Keywords',
    description:
      'Explore packages in the unified ecosystem with the “' + d + '” keyword',
    pathname: '/explore/keyword/' + d + '/'
  })
})

Object.keys(data.packagesByScope).forEach((d) => {
  page(() => scope(data, d), {
    title: d + ' - Scope',
    description:
      'Explore packages in the unified ecosystem in the “' + d + '” scope',
    pathname: '/explore/package/' + d + '/'
  })
})

page(() => topics(data), {
  title: 'Topics - Explore',
  description: 'Explore projects in the unified ecosystem by topic',
  pathname: '/explore/topic/'
})

Object.keys(data.projectsByTopic).forEach((d) => {
  page(() => topic(data, d), {
    title: d + ' - Topics',
    description:
      'Explore projects in the unified ecosystem with the “' + d + '” topic',
    pathname: '/explore/topic/' + d + '/'
  })
})

Object.keys(data.projectsByOwner).forEach((d) => {
  page(() => owner(data, d), {
    title: '@' + d + ' - Owner',
    description: 'Explore projects in the unified ecosystem by “@' + d + '”',
    pathname: '/explore/project/' + d + '/'
  })
})

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

Object.keys(data.projectByRepo).forEach((d) => {
  var {description, topics} = data.projectByRepo[d]

  page(() => project(data, d), {
    title: d,
    description,
    tags: topics,
    pathname: '/explore/project/' + d + '/'
  })
})

Object.keys(data.packageByName).forEach((d) => {
  var pack = data.packageByName[d]
  var {description, readmeName, repo, manifestBase, keywords} = pack
  var input = join('data', 'readme', readmeName)
  var pathname = '/explore/package/' + d + '/'

  tasks.push(() =>
    vfile.read(input).then((file) => {
      var meta = {title: d, description, pathname, tags: keywords}

      file.data = {meta, repo, dirname: manifestBase}

      return readmePipeline
        .run(readmePipeline.parse(file), file)
        .then((tree) => ({tree: pkg(data, d, tree), file}))
    })
  )
})

page(() => community({teams, humans, sponsors, users}), {
  title: 'Community',
  description: 'Get involved, meet the team, and support us',
  pathname: '/community/'
})

page(() => members({teams, humans}), {
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

var promises = tasks.map((fn) => () => {
  return Promise.resolve(fn())
    .then(({tree, file}) =>
      pipeline.run(tree, file).then((tree) => ({tree, file}))
    )
    .then(({tree, file}) => {
      file.contents = pipeline.stringify(tree, file)
      return file
    })
    .then((file) => vfile.write(file).then(() => file))
    .then(done, done)

  function done(x) {
    console.log(report(x))
  }
})

all(promises, {concurrency: 50})

function page(fn, meta) {
  tasks.push(() => {
    return {tree: fn(), file: vfile({data: {meta}})}
  })
}

function expandDescription(map) {
  Object.keys(map).forEach((id) => {
    var d = map[id]
    var tree = descriptionPipeline.parse(d.description)
    d.descriptionRich = descriptionPipeline.runSync(tree)
  })
}
