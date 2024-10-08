import fs from 'node:fs/promises'
import process from 'node:process'
import dotenv from 'dotenv'
import yaml from 'yaml'

dotenv.config()

const ghToken = process.env.GH_TOKEN

if (!ghToken) {
  console.error('Cannot crawl team without GH token')
  process.exit()
}

const base = 'https://raw.githubusercontent.com/unifiedjs/collective/HEAD/data/'
const humans = 'humans.yml'
const files = [humans, 'teams.yml']

const humansTypes = [
  '/**',
  ' * @typedef Human',
  ' * @property {string} name',
  ' * @property {string} [email]',
  ' * @property {string} [url]',
  ' * @property {string} github',
  ' * @property {string} npm',
  ' */',
  '',
  '/** @type {ReadonlyArray<Human>} */',
  ''
].join('\n')

const teamsTypes = [
  '/**',
  " * @typedef {'contributor' | 'maintainer' | 'merger' | 'releaser'} Role",
  ' *',
  ' * @typedef Team',
  ' * @property {true} [collective]',
  ' * @property {Record<string, Role>} humans',
  ' * @property {string} [lead]',
  ' * @property {string} name',
  ' */',
  '',
  '/** @type {ReadonlyArray<Team>} */',
  ''
].join('\n')

for (const filename of files) {
  const response = await fetch(base + filename, {
    headers: {Authorization: 'bearer ' + ghToken}
  })
  const d = await response.text()
  const stem = filename.replace(/\.[a-z]+$/i, '')
  await fs.writeFile(
    new URL('../data/' + stem + '.js', import.meta.url),
    [
      filename === humans ? humansTypes : teamsTypes,
      'export const ' +
        stem +
        ' = ' +
        JSON.stringify(yaml.parse(d), undefined, 2)
    ].join('\n')
  )
}
