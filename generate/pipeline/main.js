/**
 * @import {Root} from 'hast'
 * @import {VFile} from 'vfile'
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import rehypeDocument from 'rehype-document'
import rehypeMeta from 'rehype-meta'
import rehypeMinifyUrl from 'rehype-minify-url'
import rehypePresetMinify from 'rehype-preset-minify'
import rehypePreventFaviconRequest from 'rehype-prevent-favicon-request'
import rehypeStringify from 'rehype-stringify'
import {unified} from 'unified'
import rehypeDefer from '../plugin/rehype-defer.js'
import rehypePictures from '../plugin/rehype-pictures.js'
import rehypeWrap from '../plugin/rehype-wrap.js'

// Pipeline that everything goes through.
export const main = unified()
  .use(rehypeWrap)
  .use(rehypePictures, {
    base: new URL('../../build/', import.meta.url),
    from: 'https://unifiedjs.com'
  })
  .use(rehypeDocument, {
    js: ['/browser.js', '/search.js'],
    link: [
      {
        href: '/rss.xml',
        rel: 'alternate',
        title: 'unifiedjs.com',
        type: 'application/rss+xml'
      },
      // We take images from these two, so preconnect asap.
      {href: 'https://github.com', rel: 'preconnect'},
      {href: 'https://images.opencollective.com', rel: 'preconnect'},
      {
        href: 'https://esm.sh/@wooorm/starry-night@3/style/both.css',
        rel: 'stylesheet'
      },
      {href: '/index.css', rel: 'stylesheet'},
      {
        href: '/big.css',
        media: '(min-width:36em)',
        rel: 'stylesheet'
      },
      {
        href: '/dark.css',
        media: '(prefers-color-scheme:dark)',
        rel: 'stylesheet'
      }
    ],
    title: 'unified'
  })
  .use(rehypeMeta, {
    color: '#0366d6',
    copyright: true,
    image: {
      alt: 'We compile content to syntax trees and syntax trees to content. We also provide hundreds of packages to work on the trees in between. You can build on the unified collective to make all kinds of interesting things.',
      height: 690,
      url: 'https://unifiedjs.com/image/cover-1200.png',
      width: 1200
    },
    name: 'unified',
    og: true,
    siteAuthor: 'unified collective',
    siteTags: ['ast', 'parse', 'process', 'stringify', 'transform', 'unified'],
    siteTwitter: '@unifiedjs',
    twitter: true,
    type: 'website'
  })
  .use(rehypeDefer)
  .use(rehypePresetMinify)
  .use(rehypePreventFaviconRequest)
  .use(rehypeMinifyUrl)
  .use(move)
  .use(mkdir)
  .use(rehypeStringify)
  .freeze()

/**
 * Plugin that moves a file’s path to the output location.
 */
function move() {
  /**
   * @param {Root} _
   * @param {VFile} file
   * @returns {undefined}
   */
  return function (_, file) {
    const meta = file.data.meta
    assert(meta)
    const pathname = meta.pathname
    assert(typeof pathname === 'string')
    const parts = pathname.slice(1).split('/')
    const last = parts.pop()

    parts.unshift('build')
    parts.push(last || 'index')

    file.path = parts.join('/')
    file.extname = '.html'
    file.history = [file.path]
  }
}

/**
 * Plugin to make sure the directories to a file exist.
 */
function mkdir() {
  /**
   * @param {Root} _
   * @param {VFile} file
   * @returns {Promise<undefined>}
   */
  return async function (_, file) {
    assert(file.dirname)
    await fs.mkdir(file.dirname, {recursive: true})
  }
}
