import fs from 'node:fs'
import path from 'node:path'
import {toVFile} from 'to-vfile'
import sharp from 'sharp'
import {rename} from 'vfile-rename'
import {visit} from 'unist-util-visit'
import {h} from 'hastscript'

export default function rehypePictures(options) {
  const sizes = [null, 200, 600, 1200, 2000]
  const formats = ['webp', 'png']
  const mimes = {webp: 'image/webp', png: 'image/png'}
  const modes = ['', '-dark']
  const base = options.base
  const sources = formats
    .flatMap((format) =>
      modes.flatMap((mode) =>
        sizes.flatMap((size) => ({
          stem: {suffix: mode + (size ? '-' + size : '')},
          extname: '.' + format
        }))
      )
    )
    // Remove the default file, w/o mode (light) and w/o size: that’s what we
    // link to already.
    .filter((d) => d.stem.suffix !== '')

  return transform

  function transform(tree) {
    const promises = []

    visit(tree, 'element', visitor)

    if (promises.length > 0) {
      return Promise.all(promises).then(() => {})
    }

    function visitor(node, _, parent) {
      const src = (node.tagName === 'img' && node.properties.src) || ''

      if (!src || src.charAt(0) !== '/') {
        return
      }

      promises.push(rewrite(src, node, parent))

      function rewrite(src, node, parent) {
        const resolved = path.join(base, src.split('/').join(path.sep))
        const promises = [].concat(
          // See which images exist.
          sources.map((d) => {
            const file = toVFile({path: resolved})
            rename(file, d)
            const fp = file.path

            return fs.promises.access(fp, fs.constants.R_OK).then(
              () => fp,
              () => {}
            )
          }),
          // See dimension.
          sharp(resolved).metadata()
        )

        return Promise.all(promises).then((result) => {
          const info = result.pop()
          const available = new Set(result.filter(Boolean))

          // Generate the sources, but only if they exist.
          const srcs = formats.flatMap((format) =>
            modes.flatMap((mode) => {
              const applicable = sizes
                .map((size) => {
                  const file = toVFile({path: resolved})
                  rename(file, {
                    stem: {suffix: mode + (size ? '-' + size : '')},
                    extname: '.' + format
                  })
                  const fp = file.path

                  return available.has(fp) ? [fp, size] : []
                })
                .filter((d) => d.length > 0)

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
                      '(prefers-color-scheme: ' +
                      (mode ? 'dark' : 'light') +
                      ')',
                    type: mimes[format]
                  })
            })
          )

          const siblings = parent.children

          node.properties.loading = 'lazy'
          node.properties.width = info.width
          node.properties.height = info.height

          siblings[siblings.indexOf(node)] = h('picture', {}, srcs.concat(node))
        })
      }
    }
  }
}
