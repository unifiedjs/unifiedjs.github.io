/**
 * @import {Package} from '../data/packages.js'
 * @import {Project} from '../data/projects.js'
 */

/**
 * @typedef {typeof data} Data
 */

import {packages} from '../data/packages.js'
import {projects} from '../data/projects.js'

export const data = {
  /** @type {Record<string, Package>} */
  packageByName: {},
  /** @type {Record<string, Array<string>>} */
  packagesByKeyword: {},
  /** @type {Record<string, Array<string>>} */
  packagesByRepo: {},
  /** @type {Record<string, Array<string>>} */
  packagesByScope: {},
  /** @type {Record<string, Project>} */
  projectByRepo: {},
  /** @type {Record<string, Array<string>>} */
  projectsByOwner: {},
  /** @type {Record<string, Array<string>>} */
  projectsByTopic: {}
}

for (const d of projects) {
  const {repo, topics} = d

  data.projectByRepo[repo] = d

  index(data.projectsByOwner, repo.split('/')[0], repo)

  for (const d of topics) {
    index(data.projectsByTopic, d, repo)
  }
}

for (const p of packages) {
  const {keywords, name, repo} = p
  const pos = name.indexOf('/')
  const scope = pos === -1 ? undefined : p.name.slice(0, pos)

  data.packageByName[name] = p

  index(data.packagesByRepo, repo, name)

  if (scope) {
    index(data.packagesByScope, scope, name)
  }

  if (keywords) {
    for (const d of keywords) {
      index(data.packagesByKeyword, d, name)
    }
  }
}

/**
 * @template T
 * @param {Record<string, Array<T>>} object
 * @param {string} key
 * @param {T} value
 * @returns {undefined}
 */
function index(object, key, value) {
  let list = object[key]

  if (!list) {
    list = []
    object[key] = list
  }

  list.push(value)
}
