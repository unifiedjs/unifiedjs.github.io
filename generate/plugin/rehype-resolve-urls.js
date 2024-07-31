/**
 * @import {Element, Root} from 'hast'
 * @import {BuildVisitor} from 'unist-util-visit'
 * @import {VFile} from 'vfile'
 */

/**
 * @typedef Options
 * @property {string | null | undefined} [dirname]
 * @property {string | null | undefined} [object]
 * @property {string | null | undefined} [repo]
 */

import {isElement} from 'hast-util-is-element'
import {urlAttributes} from 'html-url-attributes'
import {visit} from 'unist-util-visit'

const own = {}.hasOwnProperty
const gh = 'https://github.com'

/**
 * Resolve relative URLs to a place in a repo on GH, making them absolute.
 *
 * @param {Options | null | undefined} [options]
 *   Configuration.
 * @returns
 *   Transform.
 */
export default function rehypeResolveUrls(options) {
  const settings = options || {}

  return transform

  /**
   * @param {Root} tree
   * @param {VFile} file
   * @returns {undefined}
   */
  function transform(tree, file) {
    const data = file.data
    const repo = data.repo || settings.repo
    const dirname = data.dirname || settings.dirname || '/'
    const object = settings.object || 'HEAD'
    let prefix = [repo, 'blob', object]

    if (!repo) {
      file.fail('Missing `repo` in `options` or `file.data`', tree)
    }

    if (typeof dirname === 'string' && dirname !== '/') {
      prefix = prefix.concat(dirname.split('/'))
    }

    const base = [gh, ...prefix, ''].join('/')

    visit(tree, 'element', visitor)

    /** @type {BuildVisitor<Root, 'element'>} */
    function visitor(node) {
      for (const property in node.properties) {
        if (
          own.call(urlAttributes, property) &&
          isElement(node, urlAttributes[property])
        ) {
          resolve(node, property, node.tagName)
        }
      }
    }

    /**
     * @param {Element} node
     * @param {string} property
     * @param {string} name
     * @returns {undefined}
     */
    function resolve(node, property, name) {
      const value = node.properties[property]

      if (value && typeof value === 'object' && 'length' in value) {
        /** @type {Array<string>} */
        const result = []
        let index = -1
        while (++index < value.length) {
          result[index] = resolveOne(value[index], property, name)
        }

        node.properties[property] = result
      } else if (value !== null && value !== undefined) {
        node.properties[property] = resolveOne(value, property, name)
      }
    }

    /**
     * @param {boolean | number | string} value
     * @param {string} property
     * @param {string} name
     * @returns {string}
     */
    function resolveOne(value, property, name) {
      value = String(value)

      // Absolute paths are interpreted relative to the base, not to GH itself.
      if (value.charAt(0) === '/') {
        value = '.' + value
      }

      const url = new URL(value, base)

      if (name === 'img' && property === 'src' && url.host === 'github.com') {
        url.searchParams.set('raw', 'true')
      }

      return url.href
    }
  }
}
