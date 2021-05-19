'use strict'

var unified = require('unified')
var markdown = require('remark-parse')
var gemoji = require('remark-gemoji')
var remark2rehype = require('remark-rehype')
var raw = require('rehype-raw')
var sanitize = require('rehype-sanitize')
var schema = require('./description-schema.js')

module.exports = unified()
  .use(markdown)
  .use(gemoji)
  .use(remark2rehype, {allowDangerousHtml: true})
  .use(raw)
  .use(sanitize, schema)
  .freeze()
