/**
 * @import {Root} from 'hast'
 * @import {PackageJson} from 'type-fest'
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import {fileURLToPath} from 'node:url'
import etc from '@wooorm/starry-night/etc'
import sourceGitignore from '@wooorm/starry-night/source.gitignore'
import sourceRegexpExtended from '@wooorm/starry-night/source.regexp.extended'
import sourceRegexpPosix from '@wooorm/starry-night/source.regexp.posix'
import sourceRegexp from '@wooorm/starry-night/source.regexp'
import sourceSy from '@wooorm/starry-night/source.sy'
import sourceTsx from '@wooorm/starry-night/source.tsx'
import {common} from '@wooorm/starry-night'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeInferReadingTimeMeta from 'rehype-infer-reading-time-meta'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeStarryNight from 'rehype-starry-night'
import rehypeTwoslash from 'rehype-twoslash'
import {unified} from 'unified'
import {visit} from 'unist-util-visit'
import typescript from 'typescript'
import {link} from '../atom/icon/link.js'
import rehypeAbbreviate from '../plugin/rehype-abbreviate.js'
import rehypeLink from '../plugin/rehype-link.js'
import rehypeRewriteUrls from '../plugin/rehype-rewrite-urls.js'

const packageValue = await fs.readFile('package.json', 'utf8')
/** @type {PackageJson} */
const packageJson = JSON.parse(packageValue)
const origin = packageJson.homepage
assert(typeof origin === 'string')

const configPath = typescript.findConfigFile(
  fileURLToPath(import.meta.url),
  typescript.sys.fileExists,
  'tsconfig.json'
)
assert(configPath)
const commandLine = typescript.getParsedCommandLineOfConfigFile(
  configPath,
  undefined,
  {
    fileExists: typescript.sys.fileExists,
    getCurrentDirectory: typescript.sys.getCurrentDirectory,
    onUnRecoverableConfigFileDiagnostic(x) {
      console.warn('Unrecoverable diagnostic', x)
    },
    readDirectory: typescript.sys.readDirectory,
    readFile: typescript.sys.readFile,
    useCaseSensitiveFileNames: typescript.sys.useCaseSensitiveFileNames
  }
)
assert(commandLine)

export const article = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkFrontmatter)
  .use(remarkRehype, {allowDangerousHtml: true})
  .use(function () {
    /**
     * @param {Root} tree
     * @returns {undefined}
     */
    return function (tree) {
      visit(tree, 'element', function (node) {
        if (node.tagName === 'code' && node.data?.meta === 'twoslash') {
          const className = Array.isArray(node.properties.className)
            ? node.properties.className
            : (node.properties.className = [])
          className.push('twoslash')
        }
      })
    }
  })
  .use(rehypeRaw)
  .use(rehypeInferReadingTimeMeta)
  .use(rehypeStarryNight, {
    grammars: [
      ...common,
      etc,
      sourceGitignore,
      sourceRegexpExtended,
      sourceRegexpPosix,
      sourceRegexp,
      sourceSy,
      sourceTsx
    ],
    plainText: ['txt']
  })
  .use(rehypeTwoslash, {twoslash: {compilerOptions: commandLine.options}})
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, {
    behavior: 'prepend',
    content: link(),
    properties: {ariaLabel: 'Link to self', className: ['anchor']}
  })
  .use(rehypeAbbreviate, {
    ignore: [
      'ATX',
      'ECMAScript',
      'ESLint',
      'ID',
      'ISC',
      'JSDoc',
      'JSX',
      'MDX',
      'MIT'
    ],
    titles: {
      API: 'Application programming interface',
      ARIA: 'Accessible rich internet applications',
      AST: 'Abstract syntax tree',
      CDN: 'Content delivery network',
      CDATUM: 'Character data',
      CI: 'Continuous integration',
      CLI: 'Command-line interface',
      CSS: 'Cascading style sheets',
      DOM: 'Document object model',
      DSL: 'Domain-specific language',
      GFM: 'GitHub flavored markdown',
      HSL: 'Hue, saturation, lightness',
      HTML: 'Hypertext markup language',
      JSON: 'JavaScript object notation',
      MDN: 'Mozilla developer network',
      PR: 'Pull request',
      URL: 'Uniform resource locator',
      XML: 'Extensible markup language',
      XSS: 'Cross site scripting'
    }
  })
  .use(rehypeLink)
  .use(rehypeRewriteUrls, {origin})
  .freeze()
