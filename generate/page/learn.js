'use strict'

var h = require('hastscript')
var breadcrumbs = require('../molecule/breadcrumbs')
var list = require('../component/article/list')
var sort = require('../component/article/helper-sort')
var page = require('./page')

module.exports = learn

function learn(sections) {
  return page(h('.row-l.column-l', h('h2', breadcrumbs('/learn/'))), [
    h('.article.content', [
      h('h3', 'Intro'),
      h('p', [
        'unified is an interface for parsing, inspecting, transforming, and ',
        'serializing content through syntax trees. ',
        h('em', 'And'),
        ' it’s hundreds of building blocks for working on those trees.'
      ]),
      h('p', [
        'This section of our website includes several articles ranging from ',
        'recipes that complete small, specific tasks, to guides that walk ',
        'through how to complete bigger tasks.'
      ])
    ]),
    sections.flatMap((d) => [
      h('.article.content', [h('h3', d.title), h('p', d.description)]),
      list(d, sort(d.entries))
    ]),
    h('.article.content', [
      h('h3', 'Explore'),
      h('p', [
        'The readmes of our projects and packages, available through the ',
        h('a', {href: '/explore/'}, 'Explore'),
        ' section of our website (or on GitHub and npm), describe the APIs ',
        'and more in detail.'
      ])
    ])
  ])
}
