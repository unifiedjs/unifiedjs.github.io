import {promises as fs} from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import chalk from 'chalk'
import dotenv from 'dotenv'

dotenv.config()

const token = process.env.OC_TOKEN

if (!token) {
  console.log('Cannot crawl sponsors without OC token')
  /* eslint-disable-next-line unicorn/no-process-exit */
  process.exit()
}

const outpath = path.join('data', 'sponsors.js')
const min = 5

const endpoint = 'https://api.opencollective.com/graphql/v2'

const variables = {slug: 'unified'}

const ghBase = 'https://github.com/'
const twBase = 'https://twitter.com/'

const query = `query($slug: String) {
  collective(slug: $slug) {
    members(limit: 100, role: BACKER) {
      nodes {
        totalDonations { value }
        tier { name }
        account {
          id
          slug
          name
          description
          website
          twitterHandle
          githubHandle
          imageUrl
        }
      }
    }
  }
}
`

Promise.all([
  fs.readFile(path.join('crawl', 'sponsors.txt')).then((d) => {
    return String(d)
      .split('\n')
      .map((d) => {
        const spam = d.charAt(0) === '-'
        return {oc: spam ? d.slice(1) : d, spam}
      })
  }),
  fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({query, variables}),
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': token
    }
  }).then((response) => response.json())
])
  .then(([control, response]) => {
    const seen = []
    const members = response.data.collective.members.nodes
      .map((d) => {
        const oc = d.account.slug
        const github = d.account.githubHandle || undefined
        const twitter = d.account.twitterHandle || undefined
        let url = d.account.website || undefined
        const info = control.find((d) => d.oc === oc)

        if (url === ghBase + github || url === twBase + twitter) {
          url = undefined
        }

        if (!info) {
          console.log(
            chalk.red('✖') +
              ' @%s is an unknown sponsor, please define whether it’s spam or not in `sponsors.txt`',
            oc
          )
        }

        return {
          spam: !info || info.spam,
          name: d.account.name,
          description: d.account.description || undefined,
          image: d.account.imageUrl,
          oc,
          github,
          twitter,
          url,
          gold:
            (d.tier && d.tier.name && /gold/i.test(d.tier.name)) || undefined,
          amount: d.totalDonations.value
        }
      })
      .filter((d) => {
        const ignore = d.spam || seen.includes(d.oc) // Ignore dupes in data.
        seen.push(d.oc)
        return d.amount > min && !ignore
      })
      .sort(sort)
      .map((d) => Object.assign(d, {amount: undefined}))

    return fs.writeFile(
      outpath,
      'export const sponsors = ' + JSON.stringify(members, null, 2) + '\n'
    )
  })
  .catch(console.error)

function sort(a, b) {
  return b.amount - a.amount
}
