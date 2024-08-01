/**
 * @import {Element, Properties, Root} from 'hast'
 * @import {RegExpMatchObject, ReplaceFunction} from 'hast-util-find-and-replace'
 * @import {VFile} from 'vfile'
 */

/**
 * @typedef Options
 *   Configuration.
 * @property {ReadonlyArray<string> | null | undefined} [ignore]
 *   Abbreviations to ignore.
 * @property {Readonly<Record<string, string>>} titles
 *   Abbreviations.
 */

import {ok as assert} from 'devlop'
import {h} from 'hastscript'
import {defaultIgnore, findAndReplace} from 'hast-util-find-and-replace'
import pluralize from 'pluralize'

const re = /\b[A-Z]\.?[A-Z][\w.]*\b/g

/**
 * @param {Options} options
 *   Configuration.
 * @returns
 *   Transform.
 */
export default function rehypeAbbreviate(options) {
  assert(options)
  const titles = options.titles
  assert(titles)

  /**
   * @param {Root} tree
   * @param {VFile} file
   * @returns {undefined}
   */
  return function (tree, file) {
    /** @type {Set<string>} */
    const cache = new Set()

    findAndReplace(tree, [re, replace], {
      ignore: [...defaultIgnore, 'code', 'pre']
    })

    /**
     * @param {string} $0
     * @param {RegExpMatchObject} match
     * @returns {Element | string | false}
     * @satisfies {ReplaceFunction}
     */
    function replace($0, match) {
      const id = pluralize.singular($0)

      if (options.ignore?.includes(id)) {
        return false
      }

      const title = titles[id]

      if (!title) {
        file.message(
          'Unexpected abbreviation `' +
            id +
            '` w/o description in options, expected it in `ignore` or `titles`',
          {
            ancestors: match.stack,
            source: 'rehype-abbreviate',
            ruleId: 'missing-title'
          }
        )
        return false
      }

      /** @type {Properties} */
      const properties = {title}

      if (!cache.has(id)) {
        cache.add(id)
        properties.className = ['first']
      }

      return h('abbr', properties, $0)
    }
  }
}
