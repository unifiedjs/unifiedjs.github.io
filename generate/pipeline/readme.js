/**
 * @import {PackageJson} from 'type-fest'
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGemoji from 'remark-gemoji'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStarryNight from 'rehype-starry-night'
import {all} from '@wooorm/starry-night'
import {link} from '../atom/icon/link.js'
import rehypeResolveUrls from '../plugin/rehype-resolve-urls.js'
import rehypeRewriteUrls from '../plugin/rehype-rewrite-urls.js'

const packageValue = await fs.readFile('package.json', 'utf8')
/** @type {PackageJson} */
const packageJson = JSON.parse(packageValue)
const origin = packageJson.homepage
assert(typeof origin === 'string')

export const readme = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkFrontmatter)
  .use(remarkGemoji)
  .use(remarkRehype, {allowDangerousHtml: true})
  .use(rehypeRaw)
  .use(rehypeSanitize)
  .use(rehypeStarryNight, {
    grammars: all,
    plainText: ['ascii', 'mdx-broken', 'mdx-invalid', 'text', 'txt']
  })
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, {
    behavior: 'prepend',
    properties: {ariaLabel: 'Link to self', className: ['anchor']},
    content: link()
  })
  .use(rehypeResolveUrls)
  .use(rehypeRewriteUrls, {origin})
  .freeze()
