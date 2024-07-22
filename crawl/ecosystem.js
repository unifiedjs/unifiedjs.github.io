/**
 * @import {PackageJson} from 'type-fest'
 */

/**
 * @typedef GHError
 * @property {string} documentation_url
 * @property {string} message
 *
 * @typedef NpmsPackageCollectedBucket
 * @property {number} count
 * @property {string} from
 * @property {string} to
 *
 * @typedef NpmsPackageCollectedContributor
 * @property {number} commitsCount
 * @property {string} username
 *
 * @typedef NpmsPackageCollectedGithub
 * @property {Array<NpmsPackageCollectedBucket>} commits
 * @property {Array<NpmsPackageCollectedContributor>} contributors
 * @property {number} forksCount
 * @property {string} homepage
 * @property {{count: number, distribution: Record<string, number>, isDisabled: boolean, openCount: number}} issues
 * @property {number} starsCount
 * @property {number} subscribersCount
 *
 * @typedef NpmsPackageCollectedLinks
 * @property {string | undefined} [bugs]
 * @property {string} [homepage]
 * @property {string} npm
 * @property {string | undefined} [repository]
 *
 * @typedef NpmsPackageCollectedMetadata
 * @property {NpmsPackageCollectedPerson} author
 * @property {Array<NpmsPackageCollectedPerson>} contributors
 * @property {string} date
 * @property {Record<string, string>} dependencies
 * @property {string | undefined} [deprecated]
 * @property {string} description
 * @property {Record<string, string>} devDependencies
 * @property {boolean | undefined} [hasSelectiveFiles]
 * @property {boolean} hasTestScript
 * @property {Array<string>} keywords
 * @property {string} license
 * @property {NpmsPackageCollectedLinks} links
 * @property {Array<NpmsPackageCollectedPerson>} maintainers
 * @property {string} name
 * @property {NpmsPackageCollectedPerson} publisher
 * @property {string} readme
 * @property {Array<NpmsPackageCollectedBucket>} releases
 * @property {NpmsPackageCollectedRepository} repository
 * @property {string} scope
 * @property {string} version
 *
 * @typedef NpmsPackageCollectedNpm
 * @property {Array<NpmsPackageCollectedBucket>} downloads
 * @property {number} starsCount
 *
 * @typedef NpmsPackageCollectedPerson
 * @property {string} email
 * @property {string | undefined} [name]
 * @property {string | undefined} [url]
 * @property {string} username
 *
 * @typedef NpmsPackageCollectedRepository
 * @property {'git'} type
 * @property {string} url
 *
 * @typedef NpmsPackageCollectedSource
 * @property {Array<{urls: unknown, info: unknown}>} badges
 * @property {number} coverage
 * @property {{hasChangelog: boolean, readmeSize: number, testsSize: number}} files
 * @property {Array<string>} linters
 *
 * @typedef NpmsPackageCollected
 * @property {NpmsPackageCollectedGithub} github
 * @property {NpmsPackageCollectedMetadata} metadata
 * @property {NpmsPackageCollectedNpm} npm
 * @property {NpmsPackageCollectedSource} source
 *
 * @typedef NpmsPackageEvaluation
 * @property {{commitsFrequency: number, issuesDistribution: number, openIssues: number, releasesFrequency: number}} maintenance
 * @property {{communityInterest: number, dependentsCount: number, downloadsAcceleration: number, downloadsCount: number}} popularity
 * @property {{branding: number, carefulness: number, health: number, tests: number}} quality
 *
 * @typedef NpmsPackageResult
 * @property {string} analyzedAt
 * @property {NpmsPackageCollected | undefined} [collected]
 * @property {NpmsPackageEvaluation} evaluation
 * @property {NpmsPackageScore | undefined} [score]
 *
 * @typedef NpmsPackageScoreDetail
 * @property {number} maintenance
 * @property {number} popularity
 * @property {number} quality
 *
 * @typedef NpmsPackageScore
 * @property {number} final
 * @property {NpmsPackageScoreDetail} detail
 *
 *
 * @typedef PackageInfo
 * @property {string} description
 * @property {Array<string>} keywords
 * @property {string | undefined} latest
 * @property {string | undefined} license
 * @property {string} name
 * @property {number} score
 *
 * @typedef RawPackage
 * @property {string} description
 * @property {number} downloads
 * @property {number | undefined} [gzip]
 * @property {Array<string>} keywords
 * @property {string | undefined} [latest]
 * @property {string | undefined} [license]
 * @property {string | undefined} [manifestBase]
 * @property {string} name
 * @property {string} readmeName
 * @property {string} repo
 * @property {number} score
 *
 * @typedef RawProject
 * @property {string | undefined} default
 * @property {string} description
 * @property {number} issueClosed
 * @property {number} issueOpen
 * @property {Array<string>} manifests
 * @property {number} prClosed
 * @property {number} prOpen
 * @property {string} repo
 * @property {number} size
 * @property {number} stars
 * @property {Array<string>} topics
 * @property {string | undefined} url
 *
 * @typedef RawRelease
 * @property {string} description
 * @property {string} published
 * @property {string} repo
 * @property {string} tag
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import hostedGitInfo from 'hosted-git-info'
import randomUseragent from 'random-useragent'
import fetch from 'node-fetch'
import pAll from 'p-all'
import bytes from 'bytes'
import dotenv from 'dotenv'
import {unique} from '../generate/util/unique.js'
import {constantTopic} from '../generate/util/constant-topic.js'
import {constantCollective} from '../generate/util/constant-collective.js'

dotenv.config()

const ghToken = process.env.GH_TOKEN
assert(ghToken)
const npmToken = process.env.NPM_TOKEN
assert(npmToken)

const hawkgirl = 'application/vnd.github.hawkgirl-preview+json'
const ghEndpoint = 'https://api.github.com/graphql'
const npmsEndpoint = 'https://api.npms.io/v2/package'
const npmDownloadsEndpoint = 'https://api.npmjs.org/downloads'

const topicRepos = await pAll(
  constantTopic.map(function (topic) {
    return function () {
      return searchTopic(topic)
    }
  }),
  {concurrency: 1}
)

const orgRepos = await pAll(
  constantCollective.map(function (org) {
    return function () {
      return searchOrg(org)
    }
  }),
  {concurrency: 1}
)

const repos = [...topicRepos.flat(), ...orgRepos.flat()].filter(unique)

const results = await pAll(
  repos.map(function (repo) {
    return function () {
      return crawlRepo(repo)
    }
  }),
  {concurrency: 1}
)

await fs.writeFile(
  new URL('../data/releases.js', import.meta.url),
  [
    '/**',
    " * @import {Root} from 'hast'",
    ' */',
    '',
    '/**',
    ' * @typedef Release',
    ' * @property {string} description',
    ' * @property {Root} [descriptionRich]',
    ' * @property {string} published',
    ' * @property {string} repo',
    ' * @property {string} tag',
    ' */',
    '',
    '/** @type {ReadonlyArray<Release>} */',
    'export const releases = ' +
      JSON.stringify(
        results.flatMap((d) => d.releases),
        undefined,
        2
      ),
    ''
  ].join('\n')
)

const projects = results.map((d) => d.project)

await fs.writeFile(
  new URL('../data/projects.js', import.meta.url),
  [
    '/**',
    " * @import {Root} from 'hast'",
    ' */',
    '',
    '/**',
    ' * @typedef Project',
    ' * @property {string} description',
    ' * @property {Root} [descriptionRich]',
    ' * @property {string} repo',
    ' * @property {number} stars',
    ' * @property {ReadonlyArray<string>} topics',
    ' * @property {string} [url]',
    ' */',
    '',
    '/** @type {ReadonlyArray<Project>} */',
    'export const projects = ' +
      JSON.stringify(
        projects.map(function (d) {
          return {
            description: d.description,
            repo: d.repo,
            stars: d.stars,
            topics: d.topics,
            url: d.url
          }
        }),
        undefined,
        2
      ),
    ''
  ].join('\n')
)

console.info('✓ done (%d projects)', projects.length)

const meta = {size: 0, issueOpen: 0, issueClosed: 0, prOpen: 0, prClosed: 0}
const metaKeys = /** @type {Array<keyof typeof meta>} */ (Object.keys(meta))

for (const d of projects) {
  const [owner] = d.repo.split('/')

  if (constantCollective.includes(owner)) {
    for (const key of metaKeys) {
      meta[key] += d[key]
    }
  }
}

await fs.writeFile(
  new URL('../data/meta.js', import.meta.url),
  // Types are inferred correctly.
  'export const meta = ' + JSON.stringify(meta, undefined, 2) + '\n'
)

const packages = await findPackages(projects)

await fs.writeFile(
  new URL('../data/packages.js', import.meta.url),
  [
    '/**',
    " * @import {Root} from 'hast'",
    ' */',
    '',
    '/**',
    ' * @typedef Package',
    ' * @property {string} description',
    ' * @property {Root} [descriptionRich]',
    ' * @property {number} downloads',
    ' * @property {number} [gzip]',
    ' * @property {Array<string>} keywords',
    ' * @property {string} [latest]',
    ' * @property {string} [license]',
    ' * @property {string} [manifestBase]',
    ' * @property {string} name',
    ' * @property {string} readmeName',
    ' * @property {string} repo',
    ' * @property {number} score',
    ' */',
    '',
    '/** @type {ReadonlyArray<Package>} */',
    'export const packages = ' + JSON.stringify(packages, undefined, 2),
    ''
  ].join('\n')
)

console.info('✓ done (%d packages)', packages.length)

/**
 *
 * @param {ReadonlyArray<RawProject>} projects
 * @returns {Promise<Array<RawPackage>>}
 */
async function findPackages(projects) {
  /** @type {Array<RawPackage>} */
  const packages = []
  /** @type {Array<() => Promise<undefined>>} */
  const tasks = []

  for (const project of projects) {
    for (const manifest of project.manifests) {
      tasks.push(async function () {
        const {manifestBase, packageJson} = await getManifest(project, manifest)
        if (!packageJson) return
        const packageInfo = await getPackage(project, manifest, packageJson)
        if (!packageInfo) return
        const [readme, downloads, size] = await Promise.all([
          getReadme(project, manifestBase),
          getDownloads(packageInfo.name),
          getSize(packageInfo.name)
        ])
        if (!readme) return

        const readmeName =
          packageInfo.name.replace(/^@/g, '').replace(/\//g, '-') + '.md'

        await fs.writeFile(
          new URL('../data/readme/' + readmeName, import.meta.url),
          readme
        )

        packages.push({
          description: packageInfo.description,
          downloads,
          gzip: size,
          keywords: packageInfo.keywords,
          latest: packageInfo.latest,
          license: packageInfo.license,
          manifestBase,
          name: packageInfo.name,
          readmeName,
          repo: project.repo,
          score: packageInfo.score
        })
      })
    }
  }

  await pAll(tasks, {concurrency: 1})

  return packages
}

/**
 * @param {string} topic
 * @returns {Promise<Array<string>>}
 */
async function searchTopic(topic) {
  /** @type {Array<string>} */
  const matches = []
  let done = false
  /** @type {string | undefined} */
  let after

  const query = `
    query($after: String, $query: String!) {
      search(after: $after, first: 100, type: REPOSITORY, query: $query) {
        nodes { ... on Repository { nameWithOwner } }
        pageInfo { hasNextPage endCursor }
        repositoryCount
      }
    }
  `

  while (!done) {
    const response = await fetch(ghEndpoint, {
      body: JSON.stringify({
        variables: {after, query: 'sort:stars-desc topic:' + topic},
        query
      }),
      headers: {
        Authorization: 'bearer ' + ghToken,
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
    const json =
      /** @type {{data: {search: {nodes: Array<{nameWithOwner: string}>, pageInfo: {hasNextPage: boolean, endCursor: string}, repositoryCount: number}}}} */ (
        await response.json()
      )

    const data = json.data.search

    if (data.pageInfo.hasNextPage) {
      after = data.pageInfo.endCursor
    } else {
      done = true
    }

    matches.push(...data.nodes.map((d) => d.nameWithOwner))
  }

  return matches
}

/**
 * @param {string} org
 * @returns {Promise<Array<string>>}
 */
async function searchOrg(org) {
  /** @type {Array<string>} */
  const matches = []
  let done = false
  /** @type {string | undefined} */
  let after

  const query = `
    query($org: String!, $after: String) {
      organization(login: $org) {
        repositories(
          after: $after
          first: 100
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
    const response = await fetch(ghEndpoint, {
      method: 'POST',
      body: JSON.stringify({query, variables: {org, after}}),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + ghToken
      }
    })
    const json =
      /** @type {{data: {organization: {repositories: {nodes: Array<{hasIssuesEnabled: boolean, isArchived: boolean, isDisabled: boolean, isTemplate: boolean, nameWithOwner: string}>, pageInfo: {hasNextPage: boolean, endCursor: string}}}}}} */ (
        await response.json()
      )

    const data = json.data.organization.repositories

    if (data.pageInfo.hasNextPage) {
      after = data.pageInfo.endCursor
    } else {
      done = true
    }

    matches.push(
      ...data.nodes
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

  return matches
}

/**
 * @param {string} repo
 * @returns {Promise<{project: RawProject, releases: Array<RawRelease>}>}
 */
async function crawlRepo(repo) {
  const [owner, name] = repo.split('/')

  const response = await fetch(ghEndpoint, {
    body: JSON.stringify({
      query: `
        query($owner: String!, $name: String!) {
          repository(owner: $owner, name: $name) {
            defaultBranchRef { name }
            dependencyGraphManifests(withDependencies: true, first: 100) {
              nodes { exceedsMaxSize filename parseable }
            }
            diskUsage
            description
            issueClosed: issues(states: CLOSED) { totalCount }
            issueOpen: issues(states: OPEN) { totalCount }
            latestRelease { publishedAt }
            homepageUrl
            prClosed: pullRequests(states: CLOSED) { totalCount }
            prOpen: pullRequests(states: OPEN) { totalCount }
            repositoryTopics(first: 100) {
              nodes { topic { name } }
            }
            stargazers { totalCount }
          }
        }
      `,
      variables: {name, owner}
    }),
    headers: {
      Accept: hawkgirl,
      Authorization: 'bearer ' + ghToken,
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
  const json = /**
   * @type {({
   *   errors?: Array<string>,
   *   data: {
   *     repository: {
   *       defaultBranchRef?: {name: string},
   *       dependencyGraphManifests?: {nodes?: Array<{exceedsMaxSize: boolean, filename: string, parseable: boolean}>},
   *       diskUsage: number
   *       description?: string,
   *       issueClosed?: {totalCount: number},
   *       issueOpen?: {totalCount: number},
   *       latestRelease?: {publishedAt: string},
   *       homepageUrl: string,
   *       prClosed?: {totalCount: number},
   *       prOpen?: {totalCount: number},
   *       repositoryTopics: {nodes: Array<{topic: {name: string}}>}
   *       stargazers: {totalCount: number}
   *     }
   *   }
   * })}
   */ (await response.json())

  // Manifests aren’t always loaded, giving errors here: print them.
  if (json.errors) {
    console.warn(
      '%s: non-exceptional errors (probably loading manifests):',
      repo,
      json.errors
    )
  }

  const repository = json?.data?.repository
  const defaultBranch = repository?.defaultBranchRef?.name || undefined

  const lastReleaseAt = repository?.latestRelease
    ? new Date(repository.latestRelease.publishedAt)
    : undefined

  /** @type {Array<RawRelease>} */
  const releases = []

  if (lastReleaseAt && recentRelease(lastReleaseAt)) {
    const releaseResponse = await fetch(ghEndpoint, {
      body: JSON.stringify({
        query: `
          query($owner: String!, $name: String!) {
            repository(owner: $owner, name: $name) {
              releases(first: 20, orderBy: {direction: DESC, field: CREATED_AT}) {
                nodes { description publishedAt tagName url }
              }
            }
          }
        `,
        variables: {name, owner}
      }),
      headers: {
        Authorization: 'bearer ' + ghToken,
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })

    const releaseJson =
      /** @type {{data?: {repository?: {releases?: {nodes?: Array<{description: string, publishedAt: string, tagName: string, url: string }>}}}}} */ (
        await releaseResponse.json()
      )

    const data = releaseJson?.data?.repository
    const nodes = data?.releases?.nodes || []

    for (const d of nodes) {
      if (!recentRelease(new Date(d.publishedAt))) continue

      releases.push({
        description: d.description,
        published: d.publishedAt,
        repo,
        tag: d.tagName
      })
    }
  }

  return {
    project: {
      default: defaultBranch,
      description: repository.description || '',
      issueClosed: repository.issueClosed?.totalCount || 0,
      issueOpen: repository.issueOpen?.totalCount || 0,
      manifests: (repository.dependencyGraphManifests?.nodes || [])
        .filter(
          (d) =>
            defaultBranch &&
            d.filename.endsWith('package.json') &&
            d.parseable &&
            !d.exceedsMaxSize
        )
        .map((d) => d.filename),
      prClosed: repository.prClosed?.totalCount || 0,
      prOpen: repository.prOpen?.totalCount || 0,
      repo,
      // Size of repo in bytes.
      size: repository.diskUsage * 1024,
      stars: repository.stargazers?.totalCount || 0,
      topics: (repository.repositoryTopics?.nodes || [])
        .map((d) => d.topic.name)
        .filter(validTag)
        .filter(unique),
      url: repository.homepageUrl || undefined
    },
    releases
  }
}

/**
 * @param {RawProject} project
 * @param {string} manifest
 * @returns {Promise<{manifestBase: string | undefined, packageJson: PackageJson | undefined}>}
 */
async function getManifest(project, manifest) {
  const {repo} = project
  const [owner, name] = repo.split('/')
  const target = [project.default || 'master', manifest].join(':')
  /** @type {string | undefined} */
  let manifestBase = path.dirname(manifest)
  /** @type {string | undefined} */
  let packageJsonText
  /** @type {PackageJson | undefined} */
  let packageJson

  if (manifestBase === '.') {
    manifestBase = undefined
  }

  try {
    const response = await fetch(ghEndpoint, {
      body: JSON.stringify({
        query: `
          query($name: String!, $owner: String!, $target: String!) {
            repository(name: $name, owner: $owner) {
              object(expression: $target) {
                ... on Blob { text }
              }
            }
          }
        `,
        variables: {name, owner, target}
      }),
      headers: {
        Authorization: 'bearer ' + ghToken,
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
    const result =
      /** @type {{data: {repository: {object?: {text: string}}}} | GHError} */ (
        await response.json()
      )

    if ('data' in result && result.data) {
      packageJsonText = result.data.repository.object?.text
    } else {
      console.warn('%s#%s: no data:', repo, manifest, result)
    }
  } catch (error) {
    console.warn('%s#%s: could not fetch manifest:', repo, manifest, error)
  }

  try {
    packageJson = packageJsonText ? JSON.parse(packageJsonText) : undefined
  } catch {
    console.warn('%s#%s: could not parse manifest', repo, manifest)
  }

  if (packageJson) {
    if (!packageJson.name) {
      console.warn('%s#%s: ignoring manifest without name', repo, manifest)
      packageJson = undefined
    } else if (packageJson.private) {
      console.warn('%s#%s: ignoring private manifest', repo, manifest)
      packageJson = undefined
    } else if (/gatsby/i.test(packageJson.name)) {
      console.warn('%s#%s: ignoring gatsby-related package', repo, manifest)
      packageJson = undefined
    }
  }

  return {manifestBase, packageJson}
}

/**
 * @param {RawProject} project
 * @param {string} manifest
 * @param {PackageJson} packageJson
 * @returns {Promise<PackageInfo | undefined>}
 */
async function getPackage(project, manifest, packageJson) {
  assert(packageJson.name) // Checked earlier.
  // const {manifestBase, project} = ctx
  const {repo} = project
  /** @type {NpmsPackageResult | undefined} */
  let body

  try {
    const response = await fetch(
      [npmsEndpoint, encodeURIComponent(packageJson.name)].join('/')
    )
    body = /** @type {NpmsPackageResult} */ (await response.json())
  } catch {}

  if (!body || !body.collected || !body.score) {
    console.warn('%s#%s: could not connect to npms', repo, manifest)
    return
  }

  // To do: this would probabl go higher? If there’s an error returned?
  // if (body.code === 'NOT_FOUND') {
  //   console.warn('%s#%s: could not find package (on npms)', repo, manifest)
  //   return
  // }

  // To do: remove fallbacks and allow `undefined`?
  const name = body.collected.metadata.name || ''
  const description = body.collected.metadata.description || ''
  const keywords = body.collected.metadata.keywords || []
  const license = body.collected.metadata.license || undefined
  const latest = body.collected.metadata.version || undefined
  const repository = body.collected.metadata.repository
  const url = (repository && repository.url) || ''
  const score = body.score.final || 0
  // Note: we used to look at `dependents`, but that’s always on `0` apparently now?

  if (body.collected.metadata.deprecated) {
    console.warn(
      '%s#%s: ignoring deprecated package: %s',
      repo,
      manifest,
      body.collected.metadata.deprecated
    )
    return
  }

  if (!url) {
    console.warn('%s#%s: ignoring unknown repo', repo, manifest)
    return
  }

  const info = hostedGitInfo.fromUrl(url)

  if (!info) {
    console.warn('%s#%s: ignoring non-parsable repo: %s', repo, manifest, url)
    return
  }

  if (info.type !== 'github') {
    console.warn('%s#%s: ignoring non-github repo: %s', repo, manifest, url)
    return
  }

  const slug = [info.user, info.project].join('/')

  if (slug !== repo) {
    console.warn('%s#%s: ignoring mismatched repos: %s', repo, manifest, url)
    return
  }

  return {
    description,
    keywords: keywords.filter(validTag).filter(unique),
    latest,
    license,
    name,
    score
  }
}

/**
 * @param {RawProject} project
 * @param {string | undefined} manifestBase
 * @returns {Promise<string | undefined>}
 */
async function getReadme(project, manifestBase) {
  const {repo} = project
  const [owner, name] = repo.split('/')
  let base = (project.default || 'master') + ':'

  if (manifestBase) base += manifestBase + '/'

  // Instead of going through the folder and looking for the first that matches
  // `/^readme(?=\.|$)/i`, we throw the frequently used ones at GH.
  const response = await fetch(ghEndpoint, {
    body: JSON.stringify({
      query: `
          query($cmd: String!, $c: String!, $lmd: String!, $l: String!, $name: String!, $owner: String!, $umd: String!, $u: String!) {
            repository(owner: $owner, name: $name) {
              cmd: object(expression: $cmd) { ... on Blob { text } }
              c: object(expression: $c) { ... on Blob { text } }
              lmd: object(expression: $lmd) { ... on Blob { text } }
              l: object(expression: $l) { ... on Blob { text } }
              umd: object(expression: $umd) { ... on Blob { text } }
              u: object(expression: $u) { ... on Blob { text } }
            }
          }
        `,
      variables: {
        cmd: base + 'Readme.md',
        c: base + 'Readme',
        lmd: base + 'readme.md',
        l: base + 'readme',
        name,
        owner,
        umd: base + 'README.md',
        u: base + 'README'
      }
    }),
    headers: {
      Authorization: 'bearer ' + ghToken,
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
  const result =
    /** @type {{data: {repository: {umd?: {text: string}, u?: {text: string}, cmd?: {text: string}, c?: {text: string}, lmd?: {text: string}, l?: {text: string}}}}} */ (
      await response.json()
    )

  const repository = result?.data?.repository
  const object =
    repository?.umd ||
    repository?.u ||
    repository?.cmd ||
    repository?.c ||
    repository?.lmd ||
    repository?.l

  if (!object) {
    console.warn('%s#%s: could not find readme', repo, base)
    return
  }

  const readme = object?.text

  if (!readme || readme.length < 20) {
    console.warn('%s#%s: ignoring package without readme', repo, base)
    return
  }

  return readme
}

/**
 * @param {string} name
 * @returns {Promise<number>}
 */
async function getDownloads(name) {
  const endpoint = [
    npmDownloadsEndpoint,
    'point',
    'last-month',
    encodeURIComponent(name)
  ].join('/')

  const response = await fetch(endpoint, {
    // Passing an npm token recently seems to crash npm.
    // headers: {Authorization: 'Bearer ' + npmToken}
  })
  const result =
    /** @type {{downloads: number, end: string, start: string}} */ (
      await response.json()
    )

  return result.downloads
}

/**
 * @param {string} name
 * @returns {Promise<number | undefined>}
 */
async function getSize(name) {
  /** @type {string | undefined} */
  let value

  try {
    const response = await fetch(
      'https://img.shields.io/bundlephobia/minzip/' +
        encodeURIComponent(name) +
        '.json',
      {
        headers: {'User-Agent': randomUseragent.getRandom()}
      }
    )
    const result =
      /** @type {{color: string, label: string, link: unknown, message: string, name: string, value: string}} */ (
        await response.json()
      )
    value = result.value
  } catch (error) {
    console.warn('%s: could not contact `shields.io`:', name, error)
    return
  }

  // I’m not 100% why exactly but this is how bundlephobia’s JSON converts to
  // what it displays on the site:
  // => https://bundlephobia.com/api/size?package=micromark@3.0.0 => 14273
  // => https://bundlephobia.com/package/micromark@3.0.0 => 13.9kb
  return (((bytes.parse(value) / 1024) * 1000) / 1024) * 1000
}

/**
 * @param {string} d
 * @returns {boolean}
 */
function validTag(d) {
  return /^[a-zA-Z\d-]+$/.test(d)
}

/**
 * Whether this release was in the last 60 days.
 *
 * @param {Date} date
 * @returns {boolean}
 */
function recentRelease(date) {
  return date.valueOf() > Date.now() - 60 * 24 * 60 * 60 * 1000
}
