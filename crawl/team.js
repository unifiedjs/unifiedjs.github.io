import {promises as fs} from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import yaml from 'js-yaml'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const ghToken = process.env.GH_TOKEN

if (!ghToken) {
  console.log('Cannot crawl team without GH token')
  /* eslint-disable-next-line unicorn/no-process-exit */
  process.exit()
}

const headers = {Authorization: 'bearer ' + ghToken}

const base = 'https://raw.githubusercontent.com/unifiedjs/collective/HEAD/data/'
const files = ['humans.yml', 'teams.yml']

for (const filename of files) {
  const response = await fetch(base + filename, {headers})
  const d = await response.text()
  const stem = path.basename(filename, path.extname(filename))
  await fs.writeFile(
    path.join('data', stem + '.js'),
    'export const ' +
      stem +
      ' = ' +
      JSON.stringify(yaml.load(d), null, 2) +
      '\n'
  )
}
