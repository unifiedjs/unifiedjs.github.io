'use strict'

var h = require('hastscript')
var description = require('../../atom/micro/description.js')
var downloads = require('../../atom/micro/downloads.js')
var esm = require('../../atom/micro/esm.js')
var github = require('../../atom/micro/gh.js')
var graph = require('../../atom/micro/graph.js')
var gzip = require('../../atom/micro/gzip.js')
var license = require('../../atom/micro/license.js')
var npm = require('../../atom/micro/npm.js')
var score = require('../../atom/micro/score.js')
var stars = require('../../atom/micro/stars.js')
var verified = require('../../atom/micro/verified.js')
var keywords = require('../keyword/list-small.js')
var filter = require('../keyword/helper-filter.js')
var sort = require('../keyword/helper-sort.js')

module.exports = head

function head(data, id) {
  var {projectByRepo, packageByName} = data
  var d = packageByName[id]
  var project = projectByRepo[d.repo]
  var [owner, projectName] = d.repo.split('/')
  var [scope, pkgName] = id.split('/')

  if (!pkgName) {
    pkgName = scope
    scope = null
  }

  return [
    h('.row-l.column-nl', [
      h('hgroup.column', [
        h('h2', [
          h('span.x-hide-l.medlight.label', 'Project: '),
          h('a', {href: '/explore/project/' + owner}, owner),
          h('span.lowlight.separator', '/'),
          h('a', {href: '/explore/project/' + d.repo}, projectName)
        ]),
        h('h3.content', [
          h('span.x-hide-l.medlight.label', 'Package: '),
          scope ? h('a', {href: '/explore/package/' + scope}, scope) : '',
          scope ? h('span.lowlight.separator', '/') : '',
          h('a', {href: '/explore/package/' + id}, pkgName),
          d.latest
            ? [h('span.lowlight.separator', '@'), h('span.medlight', d.latest)]
            : ''
        ])
      ]),
      h('ol.flex.column.ellipsis-l', [
        graph(d.dependencies, d.dependents, id),
        description(d.description, d.descriptionRich)
      ]),
      h('.column', [
        h('ol.row.justify-end-l', [
          score(d.score),
          verified(d.repo),
          license(d.license),
          stars(project.stars, d.repo),
          github(d.repo)
        ]),
        h('ol.row.justify-end-l', [
          gzip(d.gzip, id),
          esm(d.esm, id),
          downloads(d.downloads, id),
          npm(id)
        ])
      ])
    ]),
    keywords(data, filter(data, sort(data, d.keywords)))
  ]
}
