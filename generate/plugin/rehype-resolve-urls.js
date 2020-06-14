'use strict'

var visit = require('unist-util-visit')
var map = require('../util/tag-to-url')

module.exports = resolveUrls

var own = {}.hasOwnProperty
var gh = 'https://github.com'

// Resolve relative URLs to a place in a repo on GH, making them absolute.
function resolveUrls(options) {
  var settings = options || {}

  return transform

  function transform(tree, file) {
    var data = file.data
    var repo = data.repo || settings.repo
    var dirname = data.dirname || settings.dirname || '/'
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
        map[tagName].forEach((p) => resolve(node, p, tagName))
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

    function resolveOne(value, prop, node, name) {
      if (value === undefined || value === null) {
        return
      }

      value = String(value)

      // Absolute paths are interpreted relative to the base, not to GH itself.
      if (value.charAt(0) === '/') {
        value = '.' + value
      }

      value = new URL(value, base)

      if (name === 'img' && prop === 'src' && value.host === 'github.com') {
        value.searchParams.set('raw', 'true')
      }

      return value.href
    }
  }
}
