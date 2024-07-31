/**
 * @import {Element, Properties, Root} from 'hast'
 * @import {ReplaceFunction} from 'hast-util-find-and-replace'
 * @import {VFile} from 'vfile'
 */

/**
 * @typedef {Record<string, string | null>} Titles
 */

import {h} from 'hastscript'
import {findAndReplace, defaultIgnore} from 'hast-util-find-and-replace'
import pluralize from 'pluralize'

const re = /\b([A-Z]\.?[A-Z][\w.]*)\b/g

const ignore = defaultIgnore.concat(['pre', 'code'])

/**
 * @param {Titles} titles
 *   Abbreviation titles.
 * @returns
 *   Transform.
 */
export default function rehypeAbbreviate(titles) {
  return transform

  /**
   * @param {Root} tree
   * @param {VFile} file
   * @returns {undefined}
   */
  function transform(tree, file) {
    /** @type {Array<string>} */
    const cache = []

    findAndReplace(tree, [re, replace], {ignore})

    /**
     * @param {string} $0
     * @returns {Element | string}
     * @satisfies {ReplaceFunction}
     */
    function replace($0) {
      const id = pluralize.singular($0)
      const first = !cache.includes(id)
      const title = titles[id]

      if (title === null) {
        return $0
      }

      if (!title) {
        file.message('Missing abbreviation title for `' + id + '`')
        return $0
      }

      if (first) {
        cache.push(id)
      }

      /** @type {Properties} */
      const properties = {title}

      if (first) {
        properties.className = ['first']
      }

      return h('abbr', properties, $0)
    }
  }
}
