/**
 * @import {ElementContent, Element, Parents, Root} from 'hast'
 * @import {BuildVisitor} from 'unist-util-visit'
 * @import {Spec} from 'vfile-rename'
 */

/**
 * @typedef Options
 *   Configuration.
 * @property {URL} base
 *   Base folder.
 * @property {URL | string} from
 *   Base URL.
 */

import fs from 'node:fs/promises'
import {fileURLToPath, pathToFileURL} from 'node:url'
import {h} from 'hastscript'
import sharp from 'sharp'
import {visit} from 'unist-util-visit'
import {rename} from 'vfile-rename'
import {VFile} from 'vfile'

/**
 * @param {Options} options
 *   Configuration.
 * @returns
 *   Transform.
 */
export default function rehypePictures(options) {
  const sizes = [undefined, 200, 600, 1200, 2000]
  const mimes = {png: 'image/png', webp: 'image/webp'}
  const formats = /** @type {Array<keyof typeof mimes>} */ (Object.keys(mimes))
  const modes = ['', '-dark']
  const base = options.base
  const fromUrl =
    typeof options.from === 'string' ? new URL(options.from) : options.from
  /** @type {Array<Spec>} */
  const sources = []

  for (const format of formats) {
    for (const mode of modes) {
      for (const size of sizes) {
        const suffix = mode + (size ? '-' + size : '')
        // Ignore default file, w/o mode (light) and w/o size: that’s what we
        // link to already.
        if (!suffix) continue
        sources.push({
          extname: '.' + format,
          stem: {suffix}
        })
      }
    }
  }

  return transform

  /**
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

      if (!parent || typeof src !== 'string') {
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
        const srcUrl = new URL(src, fromUrl)
        if (srcUrl.origin !== fromUrl.origin) return
        const localUrl = new URL('.' + srcUrl.pathname, base)
        /** @type {Set<string>} */
        const available = new Set()
        // See which images exist.
        /** @type {Array<Promise<undefined>>} */
        const tasks = []

        for (const d of sources) {
          tasks.push(
            (async function () {
              const file = new VFile({path: localUrl})
              rename(file, d)

              try {
                await fs.access(file.path, fs.constants.R_OK)
              } catch {
                return
              }

              available.add(file.path)
            })()
          )
        }

        await Promise.all(tasks)
        // See dimension.
        const info = await sharp(fileURLToPath(localUrl)).metadata()

        // Generate the sources, but only if they exist.
        /** @type {Array<ElementContent>} */
        const results = []

        for (const format of formats) {
          for (const mode of modes) {
            /** @type {Array<[path: string, size: number | undefined]>} */
            const applicable = []

            for (const size of sizes) {
              const file = new VFile({path: localUrl})
              rename(file, {
                extname: '.' + format,
                stem: {suffix: mode + (size ? '-' + size : '')}
              })

              if (available.has(file.path)) {
                applicable.push([file.path, size])
              }
            }

            if (applicable.length > 0) {
              /** @type {Array<string>} */
              const srcSet = []

              for (const d of applicable) {
                srcSet.push(
                  '/' +
                    pathToFileURL(d[0]).href.slice(base.href.length) +
                    (d[1] ? ' ' + d[1] + 'w' : '')
                )
              }

              results.push(
                h('source', {
                  media:
                    '(prefers-color-scheme: ' + (mode ? 'dark' : 'light') + ')',
                  srcSet: srcSet.join(','),
                  type: mimes[format]
                })
              )
            }
          }
        }

        node.properties.height = info.height
        node.properties.loading = 'lazy'
        node.properties.sizes = 'auto'
        node.properties.width = info.width

        const siblings = parent.children
        const index = siblings.indexOf(node)
        siblings[index] = h('picture', {}, [...results, node])
      }
    }
  }
}
