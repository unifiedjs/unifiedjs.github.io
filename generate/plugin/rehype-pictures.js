/**
 * @import {Element, Parents, Properties, Root} from 'hast'
 * @import {BuildVisitor} from 'unist-util-visit'
 * @import {Spec} from 'vfile-rename'
 * @import {Metadata} from 'sharp'
 */

/**
 * @typedef Options
 *   Configuration.
 * @property {string} base
 *   Base directory.
 */

import fs from 'node:fs'
import path from 'node:path'
import {VFile} from 'vfile'
import sharp from 'sharp'
import {rename} from 'vfile-rename'
import {visit} from 'unist-util-visit'
import {h} from 'hastscript'

/**
 * @param {Options} options
 *   Configuration.
 * @returns
 *   Transform.
 */
export default function rehypePictures(options) {
  const sizes = [null, 200, 600, 1200, 2000]
  const mimes = {webp: 'image/webp', png: 'image/png'}
  const formats = /** @type {Array<keyof typeof mimes>} */ (Object.keys(mimes))
  const modes = ['', '-dark']
  const base = options.base
  const sources = formats
    .flatMap((format) =>
      modes.flatMap((mode) =>
        sizes.flatMap(function (size) {
          /** @type {Spec} */
          const spec = {
            stem: {suffix: mode + (size ? '-' + size : '')},
            extname: '.' + format
          }
          return spec
        })
      )
    )
    // Remove the default file, w/o mode (light) and w/o size: that’s what we
    // link to already.
    .filter(
      (d) =>
        d.stem &&
        typeof d.stem === 'object' &&
        d.stem.suffix &&
        d.stem.suffix !== ''
    )

  return transform

  /**
   *
   * @param {Root} tree
   * @returns {Promise<undefined>}
   */
  async function transform(tree) {
    /** @type {Array<Promise<undefined>>} */
    const promises = []

    visit(tree, 'element', visitor)

    await Promise.all(promises)

    /** @type {BuildVisitor<Root, 'element'>} */
    function visitor(node, _, parent) {
      const src = node.tagName === 'img' ? node.properties.src : undefined

      if (!parent || typeof src !== 'string' || src.charAt(0) !== '/') {
        return
      }

      promises.push(rewrite(src, node, parent))

      /**
       * @param {string} src
       * @param {Element} node
       * @param {Parents} parent
       * @returns {Promise<undefined>}
       */
      async function rewrite(src, node, parent) {
        const resolved = path.join(base, src.split('/').join(path.sep))
        /** @type {[...files: Array<Promise<string | undefined>>, metadata: Promise<Metadata>]} */
        const promises = [
          // See which images exist.
          ...sources.map(async (d) => {
            const file = new VFile({path: resolved})
            rename(file, d)

            try {
              await fs.promises.access(file.path, fs.constants.R_OK)
              return file.path
            } catch {}

            return undefined
          }),
          // See dimension.
          sharp(resolved).metadata()
        ]

        const result = await Promise.all(promises)

        const info = /** @type {Metadata} */ (result.pop())
        const rest = /** @type {Array<string | undefined>} */ (result)
        const available = new Set(rest.filter((d) => typeof d === 'string'))

        // Generate the sources, but only if they exist.
        const srcs = formats.flatMap((format) =>
          modes.flatMap((mode) => {
            const applicable = sizes
              .map((size) => {
                const file = new VFile({path: resolved})
                rename(file, {
                  stem: {suffix: mode + (size ? '-' + size : '')},
                  extname: '.' + format
                })
                const fp = file.path
                /** @type {[path: string, size: number | null] | undefined} */
                const tuple = available.has(fp) ? [fp, size] : undefined

                return tuple
              })
              .filter((d) => d !== undefined)

            return applicable.length === 0
              ? []
              : h('source', {
                  srcSet: applicable
                    .map(
                      (d) =>
                        ['/' + path.relative(base, d[0])] +
                        (d[1] ? ' ' + d[1] + 'w' : '')
                    )
                    .join(','),
                  media:
                    '(prefers-color-scheme: ' + (mode ? 'dark' : 'light') + ')',
                  type: mimes[format]
                })
          })
        )

        const siblings = parent.children

        node.properties.loading = 'lazy'
        node.properties.width = info.width
        node.properties.height = info.height

        siblings[siblings.indexOf(node)] = h('picture', {}, srcs.concat(node))
      }
    }
  }
}
