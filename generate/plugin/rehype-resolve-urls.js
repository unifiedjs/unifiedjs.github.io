'use strict'

var visit = require('unist-util-visit')
var map = require('../util/tag-to-url')

module.exports = resolveUrls

var own = {}.hasOwnProperty
var gh = 'https://github.com'

// Resolve relative URLs to a place in a repo on GH, making them absolute.
function resolveUrls(options) {
  var opts = options || {}

  return transform

  function transform(tree, file) {
    var data = file.data
    var repo = data.repo || opts.repo
    var dirname = data.dirname || opts.dirname || '/'
    var prefix = [repo, 'blob', 'master']
    var base

    if (!repo) {
      file.fail('Missing `repo` in `options` or `file.data`', tree)
    }

    if (dirname && dirname !== '/') {
      prefix = prefix.concat(dirname.split('/'))
    }

    base = [gh, ...prefix, ''].join('/')

    visit(tree, 'element', visitor)

    function visitor(node) {
      var {tagName} = node
      if (own.call(map, tagName)) {
        map[tagName].forEach(p => resolve(node, p, tagName))
      }
    }

    function resolve(node, prop, name) {
      var value = node.properties[prop]
      var result
      var length
      var index

      if (value && typeof value === 'object' && 'length' in value) {
        result = []
        length = value.length
        index = -1
        while (++index < length) {
          result[index] = resolveOne(value[index], prop, node)
        }
      } else {
        result = resolveOne(value, prop, node, name)
      }

      node.properties[prop] = result
    }

    function resolveOne(val, prop, node, name) {
      if (val === undefined || val === null) {
        return
      }

      val = String(val)

      // Absolute paths are interpreted relative to the base, not to GH itself.
      if (val.charAt(0) === '/') {
        val = '.' + val
      }

      val = new URL(val, base)

      if (name === 'img' && prop === 'src' && val.host === 'github.com') {
        val.searchParams.set('raw', 'true')
      }

      return val.href
    }
  }
}
