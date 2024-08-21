/**
 * @typedef OcAccount
 *   Open Collective account.
 * @property {string | undefined} description
 *   Description.
 * @property {string | undefined} githubHandle
 *   GitHub username.
 * @property {string} id
 *   ID.
 * @property {string} imageUrl
 *   Image URL.
 * @property {string} name
 *   Name.
 * @property {string} slug
 *   Slug.
 * @property {string | undefined} twitterHandle
 *   Twitter username.
 * @property {string | undefined} website
 *   Website.
 *
 * @typedef OcCollective
 *   Open Collective collective.
 * @property {{nodes: ReadonlyArray<Readonly<OcMember>>}} members
 *   Members.
 *
 * @typedef OcData
 *   Open Collective data.
 * @property {Readonly<OcCollective>} collective
 *   Collective.
 *
 * @typedef OcMember
 *   Open Collective member.
 * @property {Readonly<OcAccount>} account
 *   Account.
 * @property {Readonly<{value: number}>} totalDonations
 *   Total donations.
 *
 * @typedef OcResponse
 *   Open Collective response.
 * @property {Readonly<OcData>} data
 *   Data.
 *
 * @typedef {Omit<SponsorRaw, 'spam'>} Sponsor
 *   Sponsor.
 *
 * @typedef SponsorRaw
 *   Sponsor (raw).
 * @property {string | undefined} [description]
 *   Description.
 * @property {string | undefined} [github]
 *   GitHub username.
 * @property {string} image
 *   Image.
 * @property {string} name
 *   Name.
 * @property {string} oc
 *   Open Collective slug.
 * @property {boolean} spam
 *   Whether it’s spam.
 * @property {number} total
 *   Total donations.
 * @property {string | undefined} [twitter]
 *   Twitter username.
 * @property {string | undefined} [url]
 *   URL.
 */

import fs from 'node:fs/promises'
import process from 'node:process'
import dotenv from 'dotenv'

dotenv.config()

const key = process.env.OC_TOKEN

if (!key) throw new Error('Missing `OC_TOKEN`')

const min = 10

const endpoint = 'https://api.opencollective.com/graphql/v2'

const variables = {slug: 'unified'}

const ghBase = 'https://github.com/'
const twBase = 'https://twitter.com/'

// To do: paginate.
const query = `query($slug: String) {
  collective(slug: $slug) {
    members(limit: 100, role: BACKER) {
      nodes {
        account {
          description
          githubHandle
          id
          imageUrl
          name
          slug
          twitterHandle
          website
        }
        totalDonations { value }
      }
    }
  }
}
`

const sponsorsTxt = await fs.readFile(
  new URL('sponsors.txt', import.meta.url),
  'utf8'
)

const collectiveResponse = await fetch(endpoint, {
  body: JSON.stringify({query, variables}),
  headers: {'Api-Key': key, 'Content-Type': 'application/json'},
  method: 'POST'
})
const collectiveBody = /** @type {Readonly<OcResponse>} */ (
  await collectiveResponse.json()
)

/** @type {Array<{oc: string, spam: boolean}>} */
const control = []

for (const d of sponsorsTxt.split('\n')) {
  const spam = d.charAt(0) === '-'

  control.push({oc: spam ? d.slice(1) : d, spam})
}

/** @type {Set<string>} */
const seen = new Set()
/** @type {Array<SponsorRaw>} */
const members = []

for (const d of collectiveBody.data.collective.members.nodes) {
  const oc = d.account.slug
  const github = d.account.githubHandle || undefined
  const twitter = d.account.twitterHandle || undefined
  let url = d.account.website || undefined
  const info = control.find(function (d) {
    return d.oc === oc
  })

  if (url === ghBase + github || url === twBase + twitter) {
    url = undefined
  }

  if (!info) {
    console.error(
      '✖ @%s is an unknown sponsor, please define whether it’s spam or not in `sponsors.txt`',
      oc
    )
  }

  /** @type {Readonly<SponsorRaw>} */
  const person = {
    description: d.account.description || undefined,
    github,
    image: d.account.imageUrl,
    name: d.account.name,
    oc,
    spam: !info || info.spam,
    total: d.totalDonations.value,
    twitter,
    url
  }

  const ignore = person.spam || seen.has(person.oc) // Ignore dupes in data.
  seen.add(person.oc)

  if (person.total > min && !ignore) {
    members.push(person)
  }
}

members.sort(sort)

/** @type {Array<Sponsor>} */
const stripped = []

for (const d of members) {
  const {spam, ...rest} = d
  stripped.push(rest)
}

await fs.writeFile(
  new URL('../data/opencollective.js', import.meta.url),
  [
    '/**',
    ' * @import {Sponsor} from "../crawl/opencollective.js"',
    ' */',
    '',
    '/** @type {Array<Sponsor>} */',
    'export const sponsors = ' + JSON.stringify(stripped, undefined, 2),
    ''
  ].join('\n')
)

/**
 * @param {Readonly<SponsorRaw>} a
 *   Left.
 * @param {Readonly<SponsorRaw>} b
 *   Right.
 * @returns {number}
 *   Sort value.
 */
function sort(a, b) {
  return b.total - a.total
}
