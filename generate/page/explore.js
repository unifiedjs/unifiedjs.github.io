'use strict'

var h = require('hastscript')
var breadcrumbs = require('../molecule/breadcrumbs')
var pkg = require('../component/package/search-preview')
var keyword = require('../component/keyword/search-preview')
var project = require('../component/project/search-preview')
var topic = require('../component/topic/search-preview')
var release = require('../component/release/explore-preview')
var page = require('./page')

module.exports = explore

function explore(data) {
  return page(h('.row-l.column-l', h('h2', breadcrumbs('/explore/'))), [
    h('#search-root', [
      h('.content', h('h3', 'Packages')),
      h('#root-keyword', keyword(data)),
      h('#root-package', pkg(data)),
      h('.content', h('h3', 'Projects')),
      h('#root-topic', topic(data)),
      h('#root-project', project(data)),
      h('#root-release', [
        h('.content', h('h3', 'Recent releases')),
        release(data)
      ])
    ])
  ])
}
