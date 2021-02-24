'use strict'

var path = require('path')
var mkdirp = require('vfile-mkdirp')
var unified = require('unified')
var minify = require('rehype-preset-minify')
var doc = require('rehype-document')
var meta = require('rehype-meta')
var stringify = require('rehype-stringify')
var wrap = require('../plugin/rehype-wrap')
var defer = require('../plugin/rehype-defer')
var pictures = require('../plugin/rehype-pictures')

// Pipeline that everything goes through.
module.exports = unified()
  .use(wrap)
  .use(pictures, {base: path.join('build')})
  .use(doc, {
    title: 'unified',
    js: ['/search.js'],
    link: [
      // We take images from these two, so preconnect asap.
      {rel: 'preconnect', href: 'https://github.com'},
      {rel: 'preconnect', href: 'https://images.opencollective.com'},
      {rel: 'stylesheet', href: '/syntax-light.css'},
      {rel: 'stylesheet', href: '/index.css'},
      {
        rel: 'stylesheet',
        href: '/big.css',
        media: '(min-width:36em)'
      },
      {
        rel: 'stylesheet',
        href: '/syntax-dark.css',
        media: '(prefers-color-scheme:dark)'
      },
      {
        rel: 'stylesheet',
        href: '/dark.css',
        media: '(prefers-color-scheme:dark)'
      }
    ]
  })
  .use(meta, {
    twitter: true,
    og: true,
    copyright: true,
    origin: 'https://unifiedjs.com',
    pathname: '/',
    type: 'website',
    name: 'unified',
    siteTags: ['unified', 'parse', 'stringify', 'process', 'ast', 'transform'],
    siteAuthor: 'unified collective',
    siteTwitter: '@unifiedjs',
    image: {
      url: 'https://unifiedjs.com/image/cover-1200.png',
      width: 1200,
      height: 690,
      alt:
        'We compile content to syntax trees and syntax trees to content. We also provide hundreds of packages to work on the trees in between. You can build on the unified collective to make all kinds of interesting things.'
    },
    color: '#0366d6'
  })
  .use(defer)
  .use(minify)
  .use(move)
  .use(mkdir)
  .use(stringify)
  .freeze()

// Plugin that moves a file’s path to the output location
function move() {
  return transform
  function transform(_, file) {
    var {pathname} = file.data.meta
    var parts = pathname.slice(1).split(path.posix.sep)
    var last = parts.pop()

    parts.unshift('build')
    parts.push(last || 'index')

    file.path = parts.join(path.sep)
    file.extname = '.html'
    file.history = [file.path]
  }
}

// Plugin to make sure the directories to a file exist.
function mkdir() {
  return transformer
  function transformer(_, file) {
    return mkdirp(file).then(() => {})
  }
}
