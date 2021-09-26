import path from 'node:path'
import {mkdirp} from 'vfile-mkdirp'
import {unified} from 'unified'
import rehypePresetMinify from 'rehype-preset-minify'
import rehypeDocument from 'rehype-document'
import rehypeMeta from 'rehype-meta'
import rehypeStringify from 'rehype-stringify'
import rehypeWrap from '../plugin/rehype-wrap.js'
import rehypeDefer from '../plugin/rehype-defer.js'
import rehypePictures from '../plugin/rehype-pictures.js'

// Pipeline that everything goes through.
export const main = unified()
  .use(rehypeWrap)
  .use(rehypePictures, {base: path.join('build')})
  .use(rehypeDocument, {
    title: 'unified',
    js: ['/search.js'],
    link: [
      // We take images from these two, so preconnect asap.
      {rel: 'preconnect', href: 'https://github.com'},
      {rel: 'preconnect', href: 'https://images.opencollective.com'},
      {rel: 'stylesheet', href: '/syntax-light.css'},
      {rel: 'stylesheet', href: '/index.css'},
      {
        rel: 'stylesheet',
        href: '/big.css',
        media: '(min-width:36em)'
      },
      {
        rel: 'stylesheet',
        href: '/syntax-dark.css',
        media: '(prefers-color-scheme:dark)'
      },
      {
        rel: 'stylesheet',
        href: '/dark.css',
        media: '(prefers-color-scheme:dark)'
      }
    ]
  })
  .use(rehypeMeta, {
    twitter: true,
    og: true,
    copyright: true,
    origin: 'https://unifiedjs.com',
    pathname: '/',
    type: 'website',
    name: 'unified',
    siteTags: ['unified', 'parse', 'stringify', 'process', 'ast', 'transform'],
    siteAuthor: 'unified collective',
    siteTwitter: '@unifiedjs',
    image: {
      url: 'https://unifiedjs.com/image/cover-1200.png',
      width: 1200,
      height: 690,
      alt: 'We compile content to syntax trees and syntax trees to content. We also provide hundreds of packages to work on the trees in between. You can build on the unified collective to make all kinds of interesting things.'
    },
    color: '#0366d6'
  })
  .use(rehypeDefer)
  .use(rehypePresetMinify)
  .use(move)
  .use(mkdir)
  .use(rehypeStringify)
  .freeze()

// Plugin that moves a file’s path to the output location
function move() {
  return transform
  function transform(_, file) {
    const {pathname} = file.data.meta
    const parts = pathname.slice(1).split(path.posix.sep)
    const last = parts.pop()

    parts.unshift('build')
    parts.push(last || 'index')

    file.path = parts.join(path.sep)
    file.extname = '.html'
    file.history = [file.path]
  }
}

// Plugin to make sure the directories to a file exist.
function mkdir() {
  return transformer
  function transformer(_, file) {
    return mkdirp(file).then(() => {})
  }
}
