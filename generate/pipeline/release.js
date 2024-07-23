/**
 * @import {Root} from 'hast'
 * @import {PackageJson} from 'type-fest'
 * @import {BuildVisitor} from 'unist-util-visit'
 * @import {Release} from '../../data/releases.js'
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkGemoji from 'remark-gemoji'
import remarkGfm from 'remark-gfm'
import remarkGithub from 'remark-github'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeHighlight from 'rehype-highlight'
import {visit} from 'unist-util-visit'
import {headingRank} from 'hast-util-heading-rank'
import {shiftHeading} from 'hast-util-shift-heading'
import rehypeResolveUrls from '../plugin/rehype-resolve-urls.js'
import rehypeRewriteUrls from '../plugin/rehype-rewrite-urls.js'

const packageValue = await fs.readFile('package.json', 'utf8')
/** @type {PackageJson} */
const packageJson = JSON.parse(packageValue)
const origin = packageJson.homepage
assert(typeof origin === 'string')

/**
 * @param {Release} d
 */
export function release(d) {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkGithub, {repository: d.repo})
    .use(remarkGemoji)
    .use(remarkRehype, {allowDangerousHtml: true})
    .use(rehypeRaw)
    .use(rehypeSanitize)
    .use(rehypeHighlight, {detect: false, plainText: ['ignore']})
    .use(rehypeResolveUrls, {repo: d.repo, object: d.tag})
    .use(rehypeRewriteUrls, {origin})
    .use(headings)
    .freeze()

  function headings() {
    return transform

    /**
     * @param {Root} tree
     * @returns {undefined}
     */
    function transform(tree) {
      let depth = 6
      const goal = 4

      visit(tree, 'element', pre)

      const shift = goal - depth

      if (shift !== 0) {
        shiftHeading(tree, shift)
      }

      /** @type {BuildVisitor<Root, 'element'>} */
      function pre(node) {
        const rank = headingRank(node)

        if (rank && rank < depth) {
          depth = rank
        }
      }
    }
  }
}
