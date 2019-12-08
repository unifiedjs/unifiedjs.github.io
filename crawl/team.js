var fs = require('fs').promises
var {join, basename, extname} = require('path')
var yaml = require('js-yaml')
var fetch = require('node-fetch')

var headers = {Authorization: 'bearer ' + process.env.GH_TOKEN}

var base = 'https://raw.githubusercontent.com/unifiedjs/collective/master/data/'
var files = ['humans.yml', 'teams.yml']

files.forEach(filename =>
  fetch(base + filename, {headers})
    .then(d => d.text())
    .then(d => {
      var stem = basename(filename, extname(filename))
      var data = JSON.stringify(yaml.safeLoad(d), null, 2) + '\n'
      return fs.writeFile(join('data', stem + '.json'), data)
    })
)
