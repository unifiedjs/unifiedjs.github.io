var fs = require('fs').promises
var {join, basename, extname} = require('path')
var yaml = require('js-yaml')
var fetch = require('node-fetch')

require('dotenv').config()

var ghToken = process.env.GH_TOKEN

if (!ghToken) {
  console.log('Cannot crawl team without GH token')
  /* eslint-disable-next-line unicorn/no-process-exit */
  process.exit()
}

var headers = {Authorization: 'bearer ' + ghToken}

var base = 'https://raw.githubusercontent.com/unifiedjs/collective/HEAD/data/'
var files = ['humans.yml', 'teams.yml']

files.forEach((filename) =>
  fetch(base + filename, {headers})
    .then((d) => d.text())
    .then((d) => {
      var stem = basename(filename, extname(filename))
      var data = JSON.stringify(yaml.safeLoad(d), null, 2) + '\n'
      return fs.writeFile(join('data', stem + '.json'), data)
    })
)
