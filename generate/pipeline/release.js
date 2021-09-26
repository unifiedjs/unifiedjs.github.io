import fs from 'node:fs'
import {unified} from 'unified'
import deepmerge from 'deepmerge'
import remarkParse from 'remark-parse'
import remarkGemoji from 'remark-gemoji'
import remarkGfm from 'remark-gfm'
import remarkGithub from 'remark-github'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeHighlight from 'rehype-highlight'
import {defaultSchema} from 'hast-util-sanitize'
import {visit} from 'unist-util-visit'
import {headingRank} from 'hast-util-heading-rank'
import {shiftHeading} from 'hast-util-shift-heading'
import rehypeResolveUrls from '../plugin/rehype-resolve-urls.js'
import rehypeRewriteUrls from '../plugin/rehype-rewrite-urls.js'

const pkg = JSON.parse(fs.readFileSync('package.json'))
const origin = pkg.homepage

const schema = deepmerge(defaultSchema, {attributes: {code: ['className']}})

export function release(d) {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkGithub, {repository: d.repo})
    .use(remarkGemoji)
    .use(remarkRehype, {allowDangerousHtml: true})
    .use(rehypeRaw)
    .use(rehypeSanitize, schema)
    .use(rehypeHighlight, {subset: false, ignoreMissing: true})
    .use(rehypeResolveUrls, {repo: d.repo, object: d.tag})
    .use(rehypeRewriteUrls, {origin})
    .use(headings)
    .freeze()

  function headings() {
    return transform

    function transform(tree) {
      let depth = 6
      const goal = 4

      visit(tree, 'element', pre)

      const shift = goal - depth

      if (shift !== 0) {
        shiftHeading(tree, shift)
      }

      function pre(node) {
        const rank = headingRank(node)

        if (rank && rank < depth) {
          depth = rank
        }
      }
    }
  }
}
