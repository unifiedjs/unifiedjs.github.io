'use strict'

var unified = require('unified')
var merge = require('deepmerge')
var markdown = require('remark-parse')
var gemoji = require('remark-gemoji')
var gfm = require('remark-gfm')
var github = require('remark-github')
var remark2rehype = require('remark-rehype')
var raw = require('rehype-raw')
var sanitize = require('rehype-sanitize')
var highlight = require('rehype-highlight')
var gh = require('hast-util-sanitize/lib/github')
var visit = require('unist-util-visit')
var headingRank = require('hast-util-heading-rank')
var shiftHeading = require('hast-util-shift-heading')
var pkg = require('../../package.json')
var resolveUrls = require('../plugin/rehype-resolve-urls.js')
var rewriteUrls = require('../plugin/rehype-rewrite-urls.js')

var origin = pkg.homepage

var schema = merge(gh, {attributes: {code: ['className']}})

module.exports = createReleasePipeline

function createReleasePipeline(d) {
  return unified()
    .use(markdown)
    .use(gfm)
    .use(github, {repository: d.repo})
    .use(gemoji)
    .use(remark2rehype, {allowDangerousHtml: true})
    .use(raw)
    .use(sanitize, schema)
    .use(highlight, {subset: false, ignoreMissing: true})
    .use(resolveUrls, {repo: d.repo, object: d.tag})
    .use(rewriteUrls, {origin})
    .use(headings)
    .freeze()

  function headings() {
    return transform

    function transform(tree) {
      var depth = 6
      var goal = 4

      visit(tree, 'element', pre)

      var shift = goal - depth

      if (shift !== 0) {
        shiftHeading(tree, shift)
      }

      function pre(node) {
        var rank = headingRank(node)

        if (rank && rank < depth) {
          depth = rank
        }
      }
    }
  }
}
