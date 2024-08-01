/**
 * @typedef Account
 * @property {string | null} description
 * @property {string | null} githubHandle
 * @property {string} id
 * @property {string} imageUrl
 * @property {string} name
 * @property {string} slug
 * @property {string | null} twitterHandle
 * @property {string | null} website
 *
 * @typedef Donation
 * @property {number} value
 *
 * @typedef Member
 * @property {Account} account
 * @property {Tier | null} tier
 * @property {Donation} totalDonations
 *
 * @typedef Person
 * @property {number} amount
 * @property {string | undefined} description
 * @property {string | undefined} github
 * @property {true | undefined} gold
 * @property {string} image
 * @property {string} name
 * @property {string} oc
 * @property {boolean} spam
 * @property {string | undefined} twitter
 * @property {string | undefined} url
 *
 * @typedef Sponsor
 * @property {string} oc
 * @property {boolean} spam
 *
 * @typedef Tier
 * @property {string} name
 */

import fs from 'node:fs/promises'
import process from 'node:process'
import dotenv from 'dotenv'

dotenv.config()

const token = process.env.OC_TOKEN

if (!token) {
  console.error('Cannot crawl sponsors without OC token')
  process.exit()
}

const min = 5

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
        tier { name }
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

const response = await fetch('https://api.opencollective.com/graphql/v2', {
  body: JSON.stringify({query, variables: {slug: 'unified'}}),
  headers: {
    'Api-Key': token,
    'Content-Type': 'application/json'
  },
  method: 'POST'
})

/** @type {Array<Sponsor>} */
const control = []

for (const d of sponsorsTxt.split('\n')) {
  const spam = d.charAt(0) === '-'

  control.push({oc: spam ? d.slice(1) : d, spam})
}

const json =
  /** @type {{data: {collective: {members: {nodes: Array<Member>}}}}} */ (
    await response.json()
  )

/** @type {Set<string>} */
const seen = new Set()
/** @type {Array<Person>} */
const members = []

for (const d of json.data.collective.members.nodes) {
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

  /** @type {Person} */
  const person = {
    amount: d.totalDonations.value,
    description: d.account.description || undefined,
    github,
    gold: (d.tier && d.tier.name && /gold/i.test(d.tier.name)) || undefined,
    image: d.account.imageUrl,
    name: d.account.name,
    oc,
    spam: !info || info.spam,
    twitter,
    url
  }

  const ignore = person.spam || seen.has(person.oc) // Ignore dupes in data.
  seen.add(person.oc)

  if (person.amount > min && !ignore) {
    members.push(person)
  }
}

members.sort(sort)

for (const d of members) {
  // @ts-expect-error: intentional.
  delete d.amount
}

await fs.writeFile(
  new URL('../data/sponsors.js', import.meta.url),
  [
    '',
    '/**',
    ' * @typedef Person',
    ' * @property {string} [description]',
    ' * @property {string} [github]',
    ' * @property {true} [gold]',
    ' * @property {string} image',
    ' * @property {string} name',
    ' * @property {string} oc',
    ' * @property {string} oc',
    ' * @property {boolean} spam',
    ' * @property {string} [twitter]',
    ' * @property {string} [url]',
    ' */',
    '',
    '/** @type {Array<Person>} */',
    'export const sponsors = ' + JSON.stringify(members, undefined, 2),
    ''
  ].join('\n')
)

/**
 * @param {Person} a
 * @param {Person} b
 * @returns {number}
 */
function sort(a, b) {
  return b.amount - a.amount
}
