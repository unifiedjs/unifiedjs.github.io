/**
 * @typedef GithubOrganizationData
 *   Github organization data.
 * @property {{nodes: ReadonlyArray<Readonly<GithubSponsorNode>>}} lifetimeReceivedSponsorshipValues
 *   Sponsorships.
 *
 * @typedef GithubSponsor
 *   GitHub sponsor.
 * @property {string} avatarUrl
 *   Avatar URL.
 * @property {string | null | undefined} [bio]
 *   Bio.
 * @property {string | null | undefined} [description]
 *   Description.
 * @property {string} login
 *   Username.
 * @property {string | null} name
 *   Name.
 * @property {string | null} websiteUrl
 *   URL.
 *
 * @typedef GithubSponsorNode
 *   GitHub sponsor node.
 * @property {number} amountInCents
 *   Total price.
 * @property {Readonly<GithubSponsor>} sponsor
 *   Sponsor.
 *
 * @typedef GithubSponsorsResponse
 *   GitHub sponsors response.
 * @property {{organization: Readonly<GithubOrganizationData>}} data
 *   Data.
 *
 * @typedef SponsorRaw
 *   Sponsor (raw).
 * @property {string | undefined} description
 *   Description.
 * @property {string} github
 *   GitHub username.
 * @property {string} image
 *   Image.
 * @property {number} total
 *   Total amount.
 * @property {string | undefined} name
 *   Name.
 * @property {string | undefined} url
 *   URL.
 */

import fs from 'node:fs/promises'
import process from 'node:process'
import dotenv from 'dotenv'

dotenv.config()

const key = process.env.GH_TOKEN

if (!key) throw new Error('Missing `GH_TOKEN`')

const outUrl = new URL('../data/github-sponsors.json', import.meta.url)

const endpoint = 'https://api.github.com/graphql'

// To do: paginate.
const query = `query($org: String!) {
  organization(login: $org) {
    lifetimeReceivedSponsorshipValues(first: 100, orderBy: {field: LIFETIME_VALUE, direction: DESC}) {
      nodes {
        amountInCents
        sponsor {
          ... on Organization { avatarUrl description login name websiteUrl }
          ... on User { avatarUrl bio login name websiteUrl }
        }
      }
    }
  }
}
`

const response = await fetch(endpoint, {
  body: JSON.stringify({query, variables: {org: 'unifiedjs'}}),
  headers: {Authorization: 'bearer ' + key, 'Content-Type': 'application/json'},
  method: 'POST'
})
const body = /** @type {Readonly<GithubSponsorsResponse>} */ (
  await response.json()
)

const collective =
  body.data.organization.lifetimeReceivedSponsorshipValues.nodes
    .map(function (d) {
      return clean(d)
    })
    .sort(sort)
    // `10` dollar minimum.
    .filter(function (d) {
      return d.total >= 10
    })

await fs.mkdir(new URL('./', outUrl), {recursive: true})
await fs.writeFile(outUrl, JSON.stringify(collective, undefined, 2) + '\n')

/**
 * @param {Readonly<GithubSponsorNode>} d
 *   Sponsor node.
 * @returns {SponsorRaw}
 *   Sponsor.
 */
function clean(d) {
  return {
    description: d.sponsor.bio || d.sponsor.description || undefined,
    github: d.sponsor.login,
    image: d.sponsor.avatarUrl,
    total: Math.floor(d.amountInCents / 100),
    name: d.sponsor.name || undefined,
    url: d.sponsor.websiteUrl || undefined
  }
}

/**
 * @param {Readonly<SponsorRaw>} a
 *   Left.
 * @param {Readonly<SponsorRaw>} b
 *   Right.
 * @returns {number}
 *   Sort order.
 */
function sort(a, b) {
  return b.total - a.total
}
