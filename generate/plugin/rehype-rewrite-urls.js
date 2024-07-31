/**
 * @import {Element, Root} from 'hast'
 * @import {BuildVisitor} from 'unist-util-visit'
 * @import {VFile} from 'vfile'
 */

/**
 * @typedef Options
 * @property {string | null | undefined} [origin]
 * @property {string | null | undefined} [pathname]
 */

import assert from 'node:assert/strict'
import {isElement} from 'hast-util-is-element'
import {urlAttributes} from 'html-url-attributes'
import {visit} from 'unist-util-visit'
import {data} from '../data.js'

const own = {}.hasOwnProperty

/**
 * @param {Options | null | undefined} [options]
 *   Configuration.
 * @returns
 *   Transform.
 */
export default function rehypeRewriteUrls(options) {
  const settings = options || {}

  return transform

  /**
   * @param {Root} tree
   * @param {VFile} file
   * @returns {undefined}
   */
  function transform(tree, file) {
    const meta = file.data.meta || {}
    const origin = meta.origin || settings.origin || undefined
    const pathname = meta.pathname || settings.pathname || '/'

    if (!origin) {
      file.fail('Missing `origin` in `options` or `file.data.meta`', tree)
    }

    visit(tree, 'element', visitor)

    /** @type {BuildVisitor<Root, 'element'>} */
    function visitor(node) {
      for (const property in node.properties) {
        if (
          own.call(urlAttributes, property) &&
          isElement(node, urlAttributes[property])
        ) {
          rewrite(node, property)
        }
      }

      if (node.tagName === 'a') {
        const head = String(node.properties.href || '').charAt(0)

        if (head && head !== '/' && head !== '#') {
          node.properties.rel = ['nofollow', 'noopener', 'noreferrer']
        }
      }
    }

    /**
     * @param {Element} node
     * @param {string} property
     * @returns {undefined}
     */
    function rewrite(node, property) {
      let value = node.properties[property]
      /** @type {URL | undefined} */
      let url

      if (value === undefined || value === null) {
        return
      }

      value = String(value)

      try {
        url = new URL(value, origin + pathname)
      } catch {
        return
      }

      url = rewriteNpm(url, origin) || rewriteGithub(url, origin) || url
      assert(url)

      // Minify / make relative.
      if (url && url.origin === origin) {
        value =
          url.pathname === pathname ? url.hash || '#' : url.pathname + url.hash
      } else {
        value = url.href
      }

      node.properties[property] = value
    }
  }

  /**
   * @param {URL} url
   * @param {string | undefined} origin
   * @returns {URL | undefined}
   */
  function rewriteNpm(url, origin) {
    let host = url.host

    if (host.startsWith('www.')) {
      host = host.slice(4)
    }

    if (host === 'npmjs.com' && url.pathname.startsWith('/package/')) {
      const rest = url.pathname.slice('/package/'.length).split('/')

      // Ignore trailing slas.
      if (rest.at(-1) === '') {
        rest.pop()
      }

      // Support unscoped and scoped.
      if (rest.length > 0 && rest.length < 3) {
        const name = rest.join('/')

        if (own.call(data.packageByName, name)) {
          return new URL('/explore/package/' + name + '/' + url.hash, origin)
        }
      }
    }
  }

  /**
   * @param {URL} url
   * @param {string | undefined} origin
   * @returns {URL | undefined}
   */
  function rewriteGithub(url, origin) {
    const host = url.host

    if (host === 'github.com') {
      let rest = url.pathname.slice(1).split('/')

      // Tree goes to directories, blob to files.
      if (rest[3] === 'master' && (rest[2] === 'tree' || rest[2] === 'blob')) {
        rest[3] = 'HEAD'
      }

      const repo = rest.slice(0, 2).join('/')

      if (own.call(data.packagesByRepo, repo)) {
        const packages = data.packagesByRepo[repo]
        rest = rest.slice(2)

        // Tree goes to directories, blob to files.
        if (rest[0] === 'tree' || rest[0] === 'blob') {
          // Ignore branch name as well.
          rest = rest.slice(2)
        }

        // Pop trailing slash.
        let tail = rest.at(-1)
        if (tail === '') {
          rest.pop()
          tail = rest.at(-1)
        }

        // Pop readme.
        if (tail && /^readme\.md$/i.test(tail)) {
          rest.pop()
        }

        // Ignore readme hash.
        if (url.hash === '#readme') {
          url.hash = ''
        }

        let length = rest.length

        while (length > -1) {
          const slugParts = rest.slice(0, length)
          const slug = slugParts.length === 0 ? undefined : slugParts.join('/')
          const match = packages.find(
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
