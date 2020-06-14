'use strict'

var unified = require('unified')
var markdown = require('remark-parse')
var gemoji = require('remark-gemoji')
var gemoji2emoji = require('remark-gemoji-to-emoji')
var remark2rehype = require('remark-rehype')
var raw = require('rehype-raw')
var sanitize = require('rehype-sanitize')
var schema = require('./description-schema')

module.exports = unified()
  .use(markdown)
  .use(gemoji)
  .use(gemoji2emoji)
  .use(remark2rehype, {allowDangerousHtml: true})
  .use(raw)
  .use(sanitize, schema)
  .freeze()
