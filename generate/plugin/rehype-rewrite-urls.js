'use strict'

var visit = require('unist-util-visit')
var data = require('../data')
var map = require('../util/tag-to-url')

module.exports = urls

var own = {}.hasOwnProperty

function urls(options) {
  var settings = options || {}

  return transform

  function transform(tree, file) {
    var meta = file.data.meta || {}
    var origin = meta.origin || settings.origin
    var pathname = meta.pathname || settings.pathname || '/'

    if (!origin) {
      file.fail('Missing `origin` in `options` or `file.data.meta`', tree)
    }

    visit(tree, 'element', visitor)

    function visitor(node) {
      var head

      if (own.call(map, node.tagName)) {
        map[node.tagName].forEach((p) => rewrite(node, p))
      }

      if (node.tagName === 'a') {
        head = (node.properties.href || '').charAt(0)

        if (head && head !== '/' && head !== '#') {
          node.properties.rel = ['nofollow', 'noopener', 'noreferrer']
        }
      }
    }

    function rewrite(node, prop) {
      var value = node.properties[prop]
      var url

      if (value === undefined || value === null) {
        return
      }

      value = String(value)

      try {
        url = new URL(value, origin + pathname)
      } catch (_) {
        return
      }

      url = rewriteNpm(url, origin) || rewriteGithub(url, origin) || url

      // Minify / make relative.
      if (url.origin === origin) {
        if (url.pathname === pathname) {
          value = url.hash || '#'
        } else {
          value = url.pathname + url.hash
        }
      } else {
        value = url.href
      }

      node.properties[prop] = value
    }
  }

  function rewriteNpm(url, origin) {
    var host = url.host
    var rest
    var name

    if (host.startsWith('www.')) {
      host = host.slice(4)
    }

    if (host === 'npmjs.com' && url.pathname.startsWith('/package/')) {
      rest = url.pathname.slice('/package/'.length).split('/')

      // Ignore trailing slasg.
      if (rest[rest.length - 1] === '') {
        rest.pop()
      }

      // Support unscoped and scoped.
      if (rest.length > 0 && rest.length < 3) {
        name = rest.join('/')

        if (own.call(data.packageByName, name)) {
          return new URL('/explore/package/' + name + '/' + url.hash, origin)
        }
      }
    }
  }

  function rewriteGithub(url, origin) {
    var host = url.host
    var rest
    var repo
    var length
    var packages
    var slug
    var match

    if (host === 'github.com') {
      rest = url.pathname.slice(1).split('/')

      // Tree goes to directories, blob to files.
      if (rest[3] === 'master' && (rest[2] === 'tree' || rest[2] === 'blob')) {
        rest[3] = 'HEAD'
      }

      repo = rest.slice(0, 2).join('/')

      if (own.call(data.projectByRepo, repo)) {
        packages = data.packagesByRepo[repo]
        rest = rest.slice(2)

        // Tree goes to directories, blob to files.
        if (rest[0] === 'tree' || rest[0] === 'blob') {
          // Ignore branch name as well.
          rest = rest.slice(2)
        }

        // Pop trailing slash.
        if (rest[rest.length - 1] === '') {
          rest.pop()
        }

        // Pop readme.
        if (/^readme.md$/i.test(rest[rest.length - 1])) {
          rest.pop()
        }

        // Ignore readme hash.
        if (url.hash === '#readme') {
          url.hash = ''
        }

        length = rest.length

        while (length > -1) {
          slug = rest.slice(0, length)
          slug = slug.length === 0 ? undefined : slug.join('/')
          match = packages.find(
            (d) => data.packageByName[d].manifestBase === slug
          )

          if (match && rest.length === length) {
            return new URL('/explore/package/' + match + '/' + url.hash, origin)
          }

          length--
        }

        // If we can’t forward to a readme in a package, forward to a project.
        if (!url.hash && rest.length === 0) {
          return new URL('/explore/project/' + repo + '/', origin)
        }
      } else {
        url.pathname = '/' + rest.join('/')
        return url
      }
    }
  }
}
