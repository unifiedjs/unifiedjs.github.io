'use strict'

var h = require('hastscript')
var description = require('../../atom/micro/description.js')
var downloads = require('../../atom/micro/downloads.js')
var github = require('../../atom/micro/gh.js')
var license = require('../../atom/micro/license.js')
var score = require('../../atom/micro/score.js')
var stars = require('../../atom/micro/stars.js')
var url = require('../../atom/micro/url.js')
var verified = require('../../atom/micro/verified.js')
var topics = require('../topic/list-small.js')
var filter = require('../topic/helper-filter.js')
var sort = require('../topic/helper-sort.js')
var reduceDownloads = require('./helper-reduce-downloads.js')
var reduceLicense = require('./helper-reduce-license.js')
var reduceScore = require('./helper-reduce-score.js')

module.exports = head

function head(data, repo) {
  var d = data.projectByRepo[repo]
  var [owner, name] = repo.split('/')

  return [
    h('.row-l.column-nl', [
      h(
        '.column',
        h('h2.content', [
          h('span.x-hide-l.medlight.label', 'Project: '),
          h('a', {href: '/explore/project/' + owner}, owner),
          h('span.lowlight.separator', '/'),
          h('a', {href: '/explore/project/' + repo}, name)
        ])
      ),
      h('ol.flex.column.ellipsis-l', [
        url(d.url),
        description(d.description, d.descriptionRich)
      ]),
      h('.column', [
        h('ol.row.justify-end-l', [
          score(reduceScore(data, repo)),
          verified(repo),
          license(reduceLicense(data, repo)),
          stars(d.stars, repo),
          github(repo)
        ]),
        h('ol.row.justify-end-l', [downloads(reduceDownloads(data, repo))])
      ])
    ]),
    topics(data, filter(data, sort(data, d.topics)))
  ]
}
