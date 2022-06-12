import {promises as fs} from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import {promisify} from 'node:util'
import hostedGitInfo from 'hosted-git-info'
import randomUseragent from 'random-useragent'
import {trough} from 'trough'
import chalk from 'chalk'
import fetch from 'node-fetch'
import pAll from 'p-all'
import bytes from 'bytes'
import dotenv from 'dotenv'
import {constantTopic} from '../generate/util/constant-topic.js'
import {constantCollective} from '../generate/util/constant-collective.js'

dotenv.config()

const ghToken = process.env.GH_TOKEN
const npmToken = process.env.NPM_TOKEN

if (!ghToken || !npmToken) {
  console.warn('Cannot crawl ecosystem without GH or npm tokens')
  /* eslint-disable-next-line unicorn/no-process-exit */
  process.exit()
}

const outpath = path.join('data')
const readmePath = path.join(outpath, 'readme')
const metaPath = path.join(outpath, 'meta.js')
const projectsPath = path.join(outpath, 'projects.js')
const packagesPath = path.join(outpath, 'packages.js')
const releasesPath = path.join(outpath, 'releases.js')

const concurrency = {concurrency: 1}

const hawkgirl = 'application/vnd.github.hawkgirl-preview+json'
const ghEndpoint = 'https://api.github.com/graphql'
const npmsEndpoint = 'https://api.npms.io/v2/package'
const npmDownloadsEndpoint = 'https://api.npmjs.org/downloads'

const topicPipeline = promisify(trough().use(searchTopic).run)
const orgPipeline = promisify(trough().use(searchOrg).run)
const repoPipeline = promisify(trough().use(crawlRepo).use(getReleases).run)
const pkgPipeline = promisify(
  trough()
    .use(getManifest)
    .use(getPackage)
    .use(getReadme)
    .use(getDownloads)
    .use(getSize).run
)

const main = promisify(
  trough()
    .use(findProjectsByTopic)
    .use(findProjectsInOrganizations)
    .use(findRepositories)
    .use(findPackages)
    .use(writeResults)
    .use(writeReadmes).run
)

main({
  ghToken,
  npmToken,
  repos: [],
  topics: constantTopic,
  orgs: constantCollective
}).then(
  (result) => {
    console.log(
      chalk.green('✓') + ' done (%d packages, %d projects, %d readmes)',
      result.packages.length,
      result.projects.length,
      result.readmes.length
    )
  },
  (error) => {
    console.log(chalk.red('✖') + ' error')
    throw error
  }
)

async function findProjectsByTopic(ctx) {
  const {topics, repos} = ctx

  const results = await pAll(
    topics.map((topic) => () => topicPipeline({...ctx, topic})),
    concurrency
  )

  return {...ctx, repos: repos.concat(results.flatMap((d) => d.matches))}
}

async function findProjectsInOrganizations(ctx) {
  const {orgs, repos} = ctx

  const results = await pAll(
    orgs.map((org) => () => orgPipeline({...ctx, org})),
    concurrency
  )

  return {...ctx, repos: repos.concat(results.flatMap((d) => d.matches))}
}

async function findRepositories(ctx) {
  let {repos} = ctx

  repos = repos.filter((d, i, data) => data.indexOf(d) === i)

  const results = await pAll(
    repos.map((repo) => () => repoPipeline({...ctx, repo})),
    concurrency
  )

  return {
    ...ctx,
    repos,
    projects: results.map((d) => d.project),
    releases: results.flatMap((d) => d.releases)
  }
}

async function findPackages(ctx) {
  let {projects} = ctx

  let packages = projects.flatMap((d) =>
    d.manifests.map((m) => ({manifest: m, project: d}))
  )

  const results = await pAll(
    packages.map(
      ({manifest, project}) =>
        () =>
          pkgPipeline({...ctx, manifest, project})
    ),
    {concurrency: 1}
  )

  const readmes = []
  const projectsWithPackages = {}
  const projectsWithPackagesIssues = {}

  packages = results
    .filter((d) => d.proper)
    .map((d) => {
      const {packageDist, readme, project, issues} = d
      const {name} = packageDist
      const {repo} = project
      const readmeName = name.replace(/^@/g, '').replace(/\//g, '-') + '.md'

      projectsWithPackages[repo] = project
      projectsWithPackagesIssues[repo] = issues

      readmes.push({name: readmeName, value: readme})

      return {...packageDist, repo, readmeName}
    })

  const meta = {size: 0, issueOpen: 0, issueClosed: 0, prOpen: 0, prClosed: 0}

  projects.forEach((d) => {
    const [owner] = d.repo.split('/')

    if (constantCollective.includes(owner)) {
      Object.keys(meta).forEach((key) => {
        meta[key] += d[key]
      })
    }
  })

  Object.keys(projectsWithPackagesIssues).forEach((d) => {
    projectsWithPackages[d].issues = projectsWithPackagesIssues[d]
  })

  projects = Object.values(projectsWithPackages).map((p) => ({
    ...p,
    default: undefined,
    manifests: undefined,
    size: undefined,
    issueOpen: undefined,
    issueClosed: undefined,
    prOpen: undefined,
    prClosed: undefined
  }))

  return {...ctx, readmes, projects, packages, meta}
}

async function writeResults(ctx) {
  const {projects, packages, releases, meta} = ctx

  await fs.writeFile(
    metaPath,
    'export const meta = ' + JSON.stringify(meta, null, 2) + '\n'
  )
  await fs.writeFile(
    projectsPath,
    'export const projects = ' + JSON.stringify(projects, null, 2) + '\n'
  )
  await fs.writeFile(
    packagesPath,
    'export const packages = ' + JSON.stringify(packages, null, 2) + '\n'
  )
  await fs.writeFile(
    releasesPath,
    'export const releases = ' + JSON.stringify(releases, null, 2) + '\n'
  )
}

async function writeReadmes(ctx) {
  const {readmes} = ctx

  await pAll(
    readmes.map(
      ({name, value}) =>
        () =>
          fs.writeFile(path.join(readmePath, name), value)
    ),
    {concurrency: 10}
  )
}

async function searchTopic(ctx) {
  const {topic, ghToken} = ctx
  let matches = []
  let done = false
  let after
  let response
  let data

  const query = `
    query($query: String!, $after: String) {
      search(query: $query, type: REPOSITORY, first: 100, after: $after) {
        repositoryCount
        pageInfo { hasNextPage endCursor }
        nodes {
          ... on Repository { nameWithOwner }
        }
      }
    }
  `

  while (!done) {
    // eslint-disable-next-line no-await-in-loop
    response = await fetch(ghEndpoint, {
      method: 'POST',
      body: JSON.stringify({
        query,
        variables: {query: 'sort:stars-desc topic:' + topic, after}
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + ghToken
      }
    }).then((x) => x.json())

    data = response.data.search

    if (data.pageInfo.hasNextPage) {
      after = data.pageInfo.endCursor
    } else {
      done = true
    }

    matches = matches.concat(data.nodes.map((d) => d.nameWithOwner))
  }

  return {matches, ...ctx}
}

async function searchOrg(ctx) {
  const {org, ghToken} = ctx
  let matches = []
  let done = false
  let after
  let response
  let data

  const query = `
    query($org: String!, $after: String) {
      organization(login: $org) {
        repositories(
          first: 100
          after: $after
          isFork: false
          isLocked: false
          privacy: PUBLIC
        ) {
          pageInfo { hasNextPage endCursor }
          nodes {
            hasIssuesEnabled
            isArchived
            isDisabled
            isTemplate
            nameWithOwner
          }
        }
      }
    }
  `

  while (!done) {
    // eslint-disable-next-line no-await-in-loop
    response = await fetch(ghEndpoint, {
      method: 'POST',
      body: JSON.stringify({query, variables: {org, after}}),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + ghToken
      }
    }).then((x) => x.json())

    data = response.data.organization.repositories

    if (data.pageInfo.hasNextPage) {
      after = data.pageInfo.endCursor
    } else {
      done = true
    }

    matches = matches.concat(
      data.nodes
        .filter(
          (d) =>
            d.hasIssuesEnabled &&
            !d.isArchived &&
            !d.isDisabled &&
            !d.isTemplate
        )
        .map((d) => d.nameWithOwner)
    )
  }

  return {matches, ...ctx}
}

async function crawlRepo(ctx) {
  const {repo, ghToken} = ctx
  const [owner, name] = repo.split('/')

  const response = await fetch(ghEndpoint, {
    method: 'POST',
    body: JSON.stringify({
      query: `
        query($owner: String!, $name: String!) {
          repository(owner: $owner, name: $name) {
            description
            homepageUrl
            stargazers { totalCount }
            defaultBranchRef { name }
            repositoryTopics(first: 100) {
              nodes { topic { name } }
            }
            dependencyGraphManifests(withDependencies: true, first: 100) {
              nodes { filename exceedsMaxSize parseable }
            }
            diskUsage
            issueOpen: issues(states: OPEN) { totalCount }
            issueClosed: issues(states: CLOSED) { totalCount }
            prOpen: pullRequests(states: OPEN) { totalCount }
            prClosed: pullRequests(states: CLOSED) { totalCount }
            latestRelease { publishedAt }
          }
        }
      `,
      variables: {owner, name}
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'bearer ' + ghToken,
      Accept: hawkgirl
    }
  }).then((x) => x.json())

  // Manifests aren’t always loaded, giving errors here: print them.
  if (response.errors) {
    console.warn(
      '%s: non-exceptional errors (probably loading manifests):',
      repo,
      response.errors
    )
  }

  const data = (response.data || {}).repository || {}
  const defaultBranch = (data.defaultBranchRef || {}).name || null

  const project = {
    repo,
    description: data.description || '',
    stars: (data.stargazers || {}).totalCount || 0,
    default: defaultBranch,
    url: data.homepageUrl || null,
    topics: ((data.repositoryTopics || {}).nodes || [])
      .map((d) => d.topic.name)
      .filter(validTag)
      .filter(unique),
    manifests: ((data.dependencyGraphManifests || {}).nodes || [])
      .filter(
        (d) =>
          defaultBranch &&
          path.posix.basename(d.filename) === 'package.json' &&
          d.parseable &&
          !d.exceedsMaxSize
      )
      .map((d) => d.filename),
    // Size of repo in bytes.
    size: data.diskUsage * 1024,
    issueOpen: (data.issueOpen || {}).totalCount || 0,
    issueClosed: (data.issueClosed || {}).totalCount || 0,
    prOpen: (data.prOpen || {}).totalCount || 0,
    prClosed: (data.prClosed || {}).totalCount || 0
  }

  return {
    ...ctx,
    project,
    lastReleaseAt: new Date(
      data.latestRelease && data.latestRelease.publishedAt
    )
  }
}

async function getReleases(ctx) {
  const {repo, ghToken, lastReleaseAt} = ctx
  const [owner, name] = repo.split('/')
  let releases = []

  if (recent(lastReleaseAt)) {
    const response = await fetch(ghEndpoint, {
      method: 'POST',
      body: JSON.stringify({
        query: `
          query($owner: String!, $name: String!) {
            repository(owner: $owner, name: $name) {
              releases(first: 20, orderBy: {direction: DESC, field: CREATED_AT}) {
                nodes { publishedAt tagName url description }
              }
            }
          }
        `,
        variables: {owner, name}
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + ghToken
      }
    }).then((x) => x.json())

    const data = (response.data || {}).repository || {}
    releases = ((data.releases || {}).nodes || [])
      .filter((d) => recent(new Date(d.publishedAt)))
      .map((d) => ({
        repo,
        published: d.publishedAt,
        tag: d.tagName,
        description: d.description
      }))
  }

  return {...ctx, releases}

  // Whether this release was in the last 60 days.
  function recent(date) {
    return date > Date.now() - 60 * 24 * 60 * 60 * 1000
  }
}

async function getManifest(ctx) {
  const {project, manifest, ghToken} = ctx
  const {repo} = project
  const [owner, name] = repo.split('/')
  const target = [project.default || 'master', manifest].join(':')
  let manifestBase = path.dirname(manifest)
  let response

  if (manifestBase === '.') {
    manifestBase = undefined
  }

  try {
    response = await fetch(ghEndpoint, {
      method: 'POST',
      body: JSON.stringify({
        query: `
          query($owner: String!, $name: String!, $target: String!) {
            repository(owner: $owner, name: $name) {
              object(expression: $target) {
                ... on Blob { text }
              }
            }
          }
        `,
        variables: {owner, name, target}
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + ghToken
      }
    }).then((x) => x.json())
  } catch (error) {
    console.warn('Could not fetch manifest:', error)
  }

  let proper = true
  let pkg

  try {
    pkg = JSON.parse((response.data.repository.object || {}).text)
  } catch {
    console.warn('%s#%s: could not parse manifest', repo, manifest)
    proper = false
  }

  if (pkg && !pkg.name) {
    console.warn('%s#%s: ignoring manifest without name', repo, manifest)
    proper = false
  } else if (pkg && pkg.private) {
    console.warn('%s#%s: ignoring private manifest', repo, manifest)
    proper = false
  } else if (pkg && /gatsby/i.test(pkg.name)) {
    console.warn('%s#%s: ignoring gatsby-related package', repo, manifest)
    proper = false
  }

  return {...ctx, proper, manifestBase, packageSource: pkg}
}

async function getPackage(ctx) {
  const {proper, manifest, manifestBase, project, packageSource} = ctx
  const {repo} = project
  let response
  let body

  if (!proper) {
    return
  }

  try {
    response = await fetch(
      [npmsEndpoint, encodeURIComponent(packageSource.name)].join('/')
    )
    body = await response.json()
  } catch {}

  if (!body || !body.collected || !body.score) {
    console.warn('%s#%s: could not connect to npms', repo, manifest)
    ctx.proper = false
    return
  }

  if (body.code === 'NOT_FOUND') {
    console.warn('%s#%s: could not find package (on npms)', repo, manifest)
    ctx.proper = false
    return
  }

  const name = body.collected.metadata.name || ''
  const description = body.collected.metadata.description || ''
  let keywords = body.collected.metadata.keywords || []
  const license = body.collected.metadata.license || null
  const deprecated = body.collected.metadata.deprecated
  const latest = body.collected.metadata.version || null
  const repos = body.collected.metadata.repository
  const url = (repos && repos.url) || ''
  const dependents = (body.collected.npm || {}).dependentsCount || 0
  const score = body.score.final || 0

  if (deprecated) {
    console.warn(
      '%s#%s: ignoring deprecated package: %s',
      repo,
      manifest,
      deprecated
    )
    ctx.proper = false
    return
  }

  if (!url) {
    console.warn('%s#%s: ignoring unknown repo', repo, manifest)
    ctx.proper = false
    return
  }

  const info = hostedGitInfo.fromUrl(url)

  if (!info) {
    console.warn('%s#%s: ignoring non-parsable repo: %s', repo, manifest, url)
    ctx.proper = false
    return
  }

  if (info.type !== 'github') {
    console.warn('%s#%s: ignoring non-github repo: %s', repo, manifest, url)
    ctx.proper = false
    return
  }

  const slug = [info.user, info.project].join('/')

  if (slug !== repo) {
    console.warn('%s#%s: ignoring mismatched repos: %s', repo, manifest, url)
    ctx.proper = false
    return
  }

  keywords = keywords.filter(validTag).filter(unique)

  return {
    ...ctx,
    packageDist: {
      name,
      manifestBase,
      latest,
      description,
      keywords,
      license,
      dependents,
      score
    }
  }
}

async function getReadme(ctx) {
  const {proper, manifestBase, project} = ctx
  const {repo} = project
  const [owner, name] = repo.split('/')
  let base = (project.default || 'master') + ':'
  let response

  if (!proper) {
    return
  }

  if (manifestBase) base += manifestBase + '/'

  // Instead of going through the folder and looking for the first that matches
  // `/^readme(?=\.|$)/i`, we throw the frequently used ones at GH.
  try {
    response = await fetch(ghEndpoint, {
      method: 'POST',
      body: JSON.stringify({
        query: `
          query($owner: String!, $name: String!, $umd: String!, $u: String!, $cmd: String!, $c: String!, $lmd: String!, $l: String!) {
            repository(owner: $owner, name: $name) {
              umd: object(expression: $umd) { ... on Blob { text } }
              u: object(expression: $u) { ... on Blob { text } }
              cmd: object(expression: $cmd) { ... on Blob { text } }
              c: object(expression: $c) { ... on Blob { text } }
              lmd: object(expression: $lmd) { ... on Blob { text } }
              l: object(expression: $l) { ... on Blob { text } }
            }
          }
        `,
        variables: {
          owner,
          name,
          umd: base + 'README.md',
          u: base + 'README',
          cmd: base + 'Readme.md',
          c: base + 'Readme',
          lmd: base + 'readme.md',
          l: base + 'readme'
        }
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + ghToken
      }
    }).then((x) => x.json())
  } catch (error) {
    console.warn('Could not fetch `readme.md`:', error)
  }

  const repository = ((response || {}).data || {}).repository || {}
  const object =
    repository.umd ||
    repository.u ||
    repository.cmd ||
    repository.c ||
    repository.lmd ||
    repository.l
  const readme = (object || {}).text || ''

  if (!object) {
    console.warn('%s#%s: could not find readme', repo, base)
    ctx.proper = false
    return
  }

  if (readme.length < 20) {
    console.warn('%s#%s: ignoring package without readme', repo, base)
    ctx.proper = false
    return
  }

  ctx.readme = readme
}

async function getDownloads(ctx) {
  const {proper, packageDist} = ctx
  // See below: `npmToken = ctx.npmToken`.

  if (!proper) {
    return
  }

  const endpoint = [
    npmDownloadsEndpoint,
    'point',
    'last-month',
    packageDist.name
  ].join('/')

  const response = await fetch(endpoint, {
    // Passing an npm token recently seems to crash npm.
    // headers: {Authorization: 'Bearer ' + npmToken}
  }).then((x) => x.json())

  ctx.packageDist = {...ctx.packageDist, downloads: response.downloads}
}

async function getSize(ctx) {
  const {proper, manifest, project, packageDist} = ctx
  const {repo} = project
  let response

  if (!proper) {
    return
  }

  const endpoint =
    'https://img.shields.io/bundlephobia/minzip/' +
    encodeURIComponent(packageDist.name) +
    '.json'

  try {
    response = await fetch(endpoint, {
      headers: {'User-Agent': randomUseragent.getRandom()}
    }).then((x) => x.json())
  } catch (error) {
    console.warn('%s#%s: could not contact shields.io', repo, manifest, error)
    // Still “proper”.
    return
  }

  // I’m not 100% why exactly but this is how bundlephobia’s JSON converts to
  // what it displays on the site:
  // => https://bundlephobia.com/api/size?package=micromark@3.0.0 => 14273
  // => https://bundlephobia.com/package/micromark@3.0.0 => 13.9kb
  const gzip = (((bytes.parse(response.value) / 1024) * 1000) / 1024) * 1000
  const dependencies = response.dependencyCount

  ctx.packageDist = {...ctx.packageDist, gzip, dependencies}
}

function unique(d, i, data) {
  return data.indexOf(d) === i
}

function validTag(d) {
  return /^[a-zA-Z\d-]+$/.test(d)
}
