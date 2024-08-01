/**
 * @import {PackageJson} from 'type-fest'
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import {fileURLToPath} from 'node:url'
import sourceGitignore from '@wooorm/starry-night/source.gitignore'
import {common} from '@wooorm/starry-night'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeStarryNight from 'rehype-starry-night'
import rehypeTwoslash from 'rehype-twoslash'
import {unified} from 'unified'
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
  .use(rehypeRaw)
  .use(rehypeStarryNight, {
    grammars: [...common, sourceGitignore],
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
    ignore: ['ECMAScript', 'JSDoc', 'JSX', 'MDX'],
    titles: {
      AST: 'Abstract syntax tree',
      CLI: 'Command-line interface',
      CSS: 'Cascading Style Sheets',
      DOM: 'Document object model',
      GFM: 'GitHub flavored markdown',
      HSL: 'Hue, saturation, lightness',
      HTML: 'Hypertext markup language',
      JSON: 'JavaScript Object Notation',
      PR: 'Pull request',
      XML: 'Extensible Markup Language',
      XSS: 'Cross Site Scripting'
    }
  })
  .use(rehypeLink)
  .use(rehypeRewriteUrls, {origin})
  .freeze()
