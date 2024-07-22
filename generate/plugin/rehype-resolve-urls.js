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

import {visit} from 'unist-util-visit'
import {tagToUrl} from '../util/tag-to-url.js'

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
      const {tagName} = node
      if (own.call(tagToUrl, tagName)) {
        tagToUrl[tagName].forEach((p) => resolve(node, p, tagName))
      }
    }

    /**
     * @param {Element} node
     * @param {string} prop
     * @param {string} name
     * @returns {undefined}
     */
    function resolve(node, prop, name) {
      const value = node.properties[prop]

      if (value && typeof value === 'object' && 'length' in value) {
        /** @type {Array<string>} */
        const result = []
        let index = -1
        while (++index < value.length) {
          result[index] = resolveOne(value[index], prop, name)
        }

        node.properties[prop] = result
      } else if (value !== null && value !== undefined) {
        node.properties[prop] = resolveOne(value, prop, name)
      }
    }

    /**
     * @param {boolean | number | string} value
     * @param {string} prop
     * @param {string} name
     * @returns {string}
     */
    function resolveOne(value, prop, name) {
      value = String(value)

      // Absolute paths are interpreted relative to the base, not to GH itself.
      if (value.charAt(0) === '/') {
        value = '.' + value
      }

      const url = new URL(value, base)

      if (name === 'img' && prop === 'src' && url.host === 'github.com') {
        url.searchParams.set('raw', 'true')
      }

      return url.href
    }
  }
}
