/**
 * @import {PackageJson} from 'type-fest'
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import {all} from '@wooorm/starry-night'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'
import rehypeStarryNight from 'rehype-starry-night'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGemoji from 'remark-gemoji'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'
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
    content: link(),
    properties: {ariaLabel: 'Link to self', className: ['anchor']}
  })
  .use(rehypeResolveUrls)
  .use(rehypeRewriteUrls, {origin})
  .freeze()
