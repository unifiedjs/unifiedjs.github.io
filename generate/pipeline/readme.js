import fs from 'fs'
import unified from 'unified'
import deepmerge from 'deepmerge'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGemoji from 'remark-gemoji'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSanitize from 'rehype-sanitize'
import rehypeHighlight from 'rehype-highlight'
import {defaultSchema} from 'hast-util-sanitize'
import {link} from '../atom/icon/link.js'
import rehypeResolveUrls from '../plugin/rehype-resolve-urls.js'
import rehypeRewriteUrls from '../plugin/rehype-rewrite-urls.js'

const pkg = JSON.parse(fs.readFileSync('package.json'))
const origin = pkg.homepage

const schema = deepmerge(defaultSchema, {attributes: {code: ['className']}})

export const readme = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkFrontmatter)
  .use(remarkGemoji)
  .use(remarkRehype, {allowDangerousHtml: true})
  .use(rehypeRaw)
  .use(rehypeSanitize, schema)
  .use(rehypeHighlight, {subset: false, ignoreMissing: true})
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, {
    behavior: 'prepend',
    properties: {ariaLabel: 'Link to self', className: ['anchor']},
    content: link()
  })
  .use(rehypeResolveUrls)
  .use(rehypeRewriteUrls, {origin})
  .freeze()
