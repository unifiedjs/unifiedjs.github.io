'use strict'

var unified = require('unified')
var merge = require('deepmerge')
var markdown = require('remark-parse')
var frontmatter = require('remark-frontmatter')
var gemoji = require('remark-gemoji')
var gemoji2emoji = require('remark-gemoji-to-emoji')
var remark2rehype = require('remark-rehype')
var raw = require('rehype-raw')
var slug = require('rehype-slug')
var autolink = require('rehype-autolink-headings')
var sanitize = require('rehype-sanitize')
var highlight = require('rehype-highlight')
var gh = require('hast-util-sanitize/lib/github')
var pkg = require('../../package.json')
var link = require('../atom/icon/link')
var resolveUrls = require('../plugin/rehype-resolve-urls')
var rewriteUrls = require('../plugin/rehype-rewrite-urls')

var origin = pkg.homepage

var schema = merge(gh, {attributes: {code: ['className']}})

module.exports = unified()
  .use(markdown)
  .use(frontmatter)
  .use(gemoji)
  .use(gemoji2emoji)
  .use(remark2rehype, {allowDangerousHTML: true})
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
