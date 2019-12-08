var projects = require('../data/projects')
var packages = require('../data/packages')

var data = {
  projectByRepo: {},
  packageByName: {},
  projectsByOwner: {},
  packagesByRepo: {},
  packagesByScope: {},
  packagesByKeyword: {},
  projectsByTopic: {}
}

module.exports = data

projects.forEach(d => {
  var {repo, topics} = d

  data.projectByRepo[repo] = d

  index(data.projectsByOwner, repo.split('/')[0], repo)

  topics.forEach(d => {
    index(data.projectsByTopic, d, repo)
  })
})

packages.forEach(p => {
  var {name, repo, keywords} = p
  var pos = name.indexOf('/')
  var scope = pos === -1 ? null : p.name.slice(0, pos)

  data.packageByName[name] = p

  index(data.packagesByRepo, repo, name)

  if (scope) {
    index(data.packagesByScope, scope, name)
  }

  if (keywords) {
    keywords.forEach(d => {
      index(data.packagesByKeyword, d, name)
    })
  }
})

function index(object, key, value) {
  ;(object[key] || (object[key] = [])).push(value)
}
