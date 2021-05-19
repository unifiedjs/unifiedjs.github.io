'use strict'

var h = require('hastscript')
var breadcrumbs = require('../molecule/breadcrumbs.js')
var pkg = require('../component/package/search-preview.js')
var keyword = require('../component/keyword/search-preview.js')
var project = require('../component/project/search-preview.js')
var topic = require('../component/topic/search-preview.js')
var release = require('../component/release/explore-preview.js')
var page = require('./page.js')

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
