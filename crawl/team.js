import {promises as fs} from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

var ghToken = process.env.GH_TOKEN

if (!ghToken) {
  console.log('Cannot crawl team without GH token')
  /* eslint-disable-next-line unicorn/no-process-exit */
  process.exit()
}

var headers = {Authorization: 'bearer ' + ghToken}

var base = 'https://raw.githubusercontent.com/unifiedjs/collective/HEAD/data/'
var files = ['humans.yml', 'teams.yml']

for (const filename of files)
  fetch(base + filename, {headers})
    .then((d) => d.text())
    .then((d) => {
      var stem = path.basename(filename, path.extname(filename))
      return fs.writeFile(
        path.join('data', stem + '.js'),
        'export const ' +
          stem +
          ' = ' +
          JSON.stringify(yaml.load(d), null, 2) +
          '\n'
      )
    })
