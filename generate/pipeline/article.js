import fs from 'fs'
import unified from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'
import rehypeLink from '../plugin/rehype-link.js'
import rehypeRewriteUrls from '../plugin/rehype-rewrite-urls.js'
import rehypeAbbreviate from '../plugin/rehype-abbreviate.js'
import {link} from '../atom/icon/link.js'

const pkg = JSON.parse(fs.readFileSync('package.json'))
var origin = pkg.homepage

export const article = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkFrontmatter)
  .use(remarkRehype, {allowDangerousHtml: true})
  .use(rehypeRaw)
  .use(rehypeHighlight, {subset: false, ignoreMissing: true})
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, {
    behavior: 'prepend',
    properties: {ariaLabel: 'Link to self', className: ['anchor']},
    content: link()
  })
  .use(rehypeAbbreviate, {
    AST: 'Abstract syntax tree',
    CLI: 'Command-line interface',
    DOM: 'Document object model',
    ECMAScript: null,
    GFM: 'GitHub flavored markdown',
    HSL: 'Hue, saturation, lightness',
    HTML: 'Hypertext markup language',
    JSX: null,
    MDX: null,
    PR: 'Pull request',
    XML: 'Extensible Markup Language',
    XSS: 'Cross Site Scripting'
  })
  .use(rehypeLink)
  .use(rehypeRewriteUrls, {origin})
  .freeze()
