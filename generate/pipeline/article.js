/**
 * @import {PackageJson} from 'type-fest'
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import sourceGitignore from '@wooorm/starry-night/source.gitignore'
import {common} from '@wooorm/starry-night'
import rehypeStarryNight from 'rehype-starry-night'
import rehypeLink from '../plugin/rehype-link.js'
import rehypeRewriteUrls from '../plugin/rehype-rewrite-urls.js'
import rehypeAbbreviate from '../plugin/rehype-abbreviate.js'
import {link} from '../atom/icon/link.js'

const packageValue = await fs.readFile('package.json', 'utf8')
/** @type {PackageJson} */
const packageJson = JSON.parse(packageValue)
const origin = packageJson.homepage
assert(typeof origin === 'string')

export const article = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkFrontmatter)
  .use(remarkRehype, {allowDangerousHtml: true})
  .use(rehypeRaw)
  .use(rehypeStarryNight, {
    grammars: [...common, sourceGitignore],
    plainText: ['txt']
  })
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, {
    behavior: 'prepend',
    properties: {ariaLabel: 'Link to self', className: ['anchor']},
    content: link()
  })
  .use(rehypeAbbreviate, {
    AST: 'Abstract syntax tree',
    CLI: 'Command-line interface',
    CSS: 'Cascading Style Sheets',
    DOM: 'Document object model',
    ECMAScript: null,
    GFM: 'GitHub flavored markdown',
    HSL: 'Hue, saturation, lightness',
    HTML: 'Hypertext markup language',
    JSDoc: null,
    JSON: 'JavaScript Object Notation',
    JSX: null,
    MDX: null,
    PR: 'Pull request',
    XML: 'Extensible Markup Language',
    XSS: 'Cross Site Scripting'
  })
  .use(rehypeLink)
  .use(rehypeRewriteUrls, {origin})
  .freeze()
