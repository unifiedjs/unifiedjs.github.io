'use strict'

var h = require('hastscript')
var description = require('../../atom/micro/description')
var downloads = require('../../atom/micro/downloads')
var esm = require('../../atom/micro/esm')
var github = require('../../atom/micro/gh')
var license = require('../../atom/micro/license')
var score = require('../../atom/micro/score')
var stars = require('../../atom/micro/stars')
var url = require('../../atom/micro/url')
var verified = require('../../atom/micro/verified')
var topics = require('../topic/list-small')
var filter = require('../topic/helper-filter')
var sort = require('../topic/helper-sort')
var reduceDownloads = require('./helper-reduce-downloads')
var reduceEsm = require('./helper-reduce-esm')
var reduceLicense = require('./helper-reduce-license')
var reduceScore = require('./helper-reduce-score')

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
        h('ol.row.justify-end-l', [
          esm(reduceEsm(data, repo)),
          downloads(reduceDownloads(data, repo))
        ])
      ])
    ]),
    topics(data, filter(data, sort(data, d.topics)))
  ]
}
