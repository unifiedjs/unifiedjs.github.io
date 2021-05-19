'use strict'

var unified = require('unified')
var merge = require('deepmerge')
var markdown = require('remark-parse')
var gfm = require('remark-gfm')
var frontmatter = require('remark-frontmatter')
var gemoji = require('remark-gemoji')
var remark2rehype = require('remark-rehype')
var raw = require('rehype-raw')
var slug = require('rehype-slug')
var autolink = require('rehype-autolink-headings')
var sanitize = require('rehype-sanitize')
var highlight = require('rehype-highlight')
var gh = require('hast-util-sanitize/lib/github')
var pkg = require('../../package.json')
var link = require('../atom/icon/link.js')
var resolveUrls = require('../plugin/rehype-resolve-urls.js')
var rewriteUrls = require('../plugin/rehype-rewrite-urls.js')

var origin = pkg.homepage

var schema = merge(gh, {attributes: {code: ['className']}})

module.exports = unified()
  .use(markdown)
  .use(gfm)
  .use(frontmatter)
  .use(gemoji)
  .use(remark2rehype, {allowDangerousHtml: true})
  .use(raw)
  .use(sanitize, schema)
  .use(highlight, {subset: false, ignoreMissing: true})
  .use(slug)
  .use(autolink, {
    behavior: 'prepend',
    properties: {ariaLabel: 'Link to self', className: ['anchor']},
    content: link()
  })
  .use(resolveUrls)
  .use(rewriteUrls, {origin})
  .freeze()
