import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import yaml from 'js-yaml'
import dotenv from 'dotenv'

dotenv.config()

const ghToken = process.env.GH_TOKEN

if (!ghToken) {
  console.error('Cannot crawl team without GH token')
  /* eslint-disable-next-line unicorn/no-process-exit */
  process.exit()
}

const base = 'https://raw.githubusercontent.com/unifiedjs/collective/HEAD/data/'
const files = ['humans.yml', 'teams.yml']

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
  const stem = path.basename(filename, path.extname(filename))
  assert(stem === 'humans' || stem === 'teams')
  await fs.writeFile(
    path.join('data', stem + '.js'),
    [
      stem === 'humans' ? humansTypes : teamsTypes,
      'export const ' +
        stem +
        ' = ' +
        JSON.stringify(yaml.load(d), undefined, 2)
    ].join('\n')
  )
}
