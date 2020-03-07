'use strict'

var {join, sep, relative} = require('path')
var fs = require('fs')
var vfile = require('to-vfile')
var sharp = require('sharp')
var rename = require('vfile-rename')
var visit = require('unist-util-visit')
var h = require('hastscript')

module.exports = urls

function urls(options) {
  var sizes = [null, 200, 600, 1200, 2000]
  var formats = ['webp', 'png']
  var mimes = {webp: 'image/webp', png: 'image/png'}
  var modes = ['', '-dark']
  var base = options.base
  var sources = formats
    .flatMap(format =>
      modes.flatMap(mode =>
        sizes.flatMap(size => ({
          stem: {suffix: mode + (size ? '-' + size : '')},
          extname: '.' + format
        }))
      )
    )
    // Remove the default file, w/o mode (light) and w/o size: that’s what we
    // link to already.
    .filter(d => d.stem.suffix !== '')

  return transform

  function transform(tree) {
    var promises = []

    visit(tree, 'element', visitor)

    if (promises.length !== 0) {
      return Promise.all(promises).then(() => {})
    }

    function visitor(node, _, parent) {
      var src = (node.tagName === 'img' && node.properties.src) || ''

      if (!src || src.charAt(0) !== '/') {
        return
      }

      promises.push(rewrite(src, node, parent))

      function rewrite(src, node, parent) {
        var resolved = join(base, src.split('/').join(sep))
        var promises = [].concat(
          // See which images exist.
          sources.map(d => {
            var fp = rename(vfile({path: resolved}), d).path

            return fs.promises.access(fp, fs.constants.R_OK).then(
              () => fp,
              () => {}
            )
          }),
          // See dimension.
          sharp(resolved).metadata()
        )

        return Promise.all(promises).then(res => {
          var info = res.pop()
          var available = res.filter(Boolean)

          // Generate the sources, but only if they exist.
          var srcs = formats.flatMap(format =>
            modes.flatMap(mode => {
              var applicable = sizes
                .map(size => {
                  var fp = rename(vfile({path: resolved}), {
                    stem: {suffix: mode + (size ? '-' + size : '')},
                    extname: '.' + format
                  }).path

                  return available.includes(fp) ? [fp, size] : []
                })
                .filter(d => d.length !== 0)

              return applicable.length === 0
                ? []
                : h('source', {
                    srcSet: applicable.map(
                      d =>
                        ['/' + relative(base, d[0])] +
                        (d[1] ? ' ' + d[1] + 'w' : '')
                    ),
                    media:
                      '(prefers-color-scheme: ' +
                      (mode ? 'dark' : 'light') +
                      ')',
                    type: mimes[format]
                  })
            })
          )

          var siblings = parent.children

          node.properties.loading = 'lazy'
          node.properties.width = info.width
          node.properties.height = info.height

          siblings[siblings.indexOf(node)] = h('picture', srcs.concat(node))
        })
      }
    }
  }
}
