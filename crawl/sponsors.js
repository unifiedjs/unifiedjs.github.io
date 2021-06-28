import {promises as fs} from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import chalk from 'chalk'
import dotenv from 'dotenv'

dotenv.config()

var token = process.env.OC_TOKEN

if (!token) {
  console.log('Cannot crawl sponsors without OC token')
  /* eslint-disable-next-line unicorn/no-process-exit */
  process.exit()
}

var outpath = path.join('data', 'sponsors.js')
var min = 5

var endpoint = 'https://api.opencollective.com/graphql/v2'

var variables = {slug: 'unified'}

var ghBase = 'https://github.com/'
var twBase = 'https://twitter.com/'

var query = `query($slug: String) {
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
        var spam = d.charAt(0) === '-'
        return {oc: spam ? d.slice(1) : d, spam: spam}
      })
  }),
  fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({query: query, variables: variables}),
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': token
    }
  }).then((response) => response.json())
])
  .then(function ([control, response]) {
    var seen = []
    var members = response.data.collective.members.nodes
      .map((d) => {
        var oc = d.account.slug
        var github = d.account.githubHandle || undefined
        var twitter = d.account.twitterHandle || undefined
        var url = d.account.website || undefined
        var info = control.find((d) => d.oc === oc)

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
          oc: oc,
          github,
          twitter,
          url,
          gold:
            (d.tier && d.tier.name && /gold/i.test(d.tier.name)) || undefined,
          amount: d.totalDonations.value
        }
      })
      .filter((d) => {
        var ignore = d.spam || seen.includes(d.oc) // Ignore dupes in data.
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
