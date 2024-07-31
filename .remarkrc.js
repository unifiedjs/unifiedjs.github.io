import fs from 'node:fs/promises'
import dictionaryEn from 'dictionary-en'
import remarkFrontmatter from 'remark-frontmatter'
import remarkLintFirstHeadingLevel from 'remark-lint-first-heading-level'
import remarkLintNoDeadUrls from 'remark-lint-no-dead-urls'
import remarkLintNoHtml from 'remark-lint-no-html'
import remarkPresetWooorm from 'remark-preset-wooorm'
import remarkRetext from 'remark-retext'
import remarkValidateLinks from 'remark-validate-links'
import retextEmoji from 'retext-emoji'
import retextEnglish from 'retext-english'
import retextEquality from 'retext-equality'
import retextPassive from 'retext-passive'
import retextPresetWooorm from 'retext-preset-wooorm'
import retextProfanities from 'retext-profanities'
import retextReadability from 'retext-readability'
import retextSimplify from 'retext-simplify'
import retextSpell from 'retext-spell'
import retextSyntaxMentions from 'retext-syntax-mentions'
import retextSyntaxUrls from 'retext-syntax-urls'
import stripComments from 'strip-comments'
import {unified} from 'unified'

const naturalLanguage = unified().use([
  retextEnglish,
  retextPresetWooorm,
  [retextEquality, {ignore: ['whitespace']}],
  retextPassive,
  [retextProfanities, {sureness: 1}],
  [retextReadability, {age: 18, minWords: 8}],
  [retextSimplify, {ignore: ['function', 'interface', 'maintain', 'type']}],
  retextEmoji,
  retextSyntaxMentions,
  retextSyntaxUrls,
  [
    retextSpell,
    {
      dictionary: dictionaryEn,
      personal: stripComments(await fs.readFile('dictionary.txt', 'utf8'))
    }
  ]
])

const config = {
  plugins: [
    remarkPresetWooorm,
    remarkFrontmatter,
    [remarkRetext, naturalLanguage],
    remarkValidateLinks,
    [remarkLintNoDeadUrls, 'https://unifiedjs.com'],
    [remarkLintFirstHeadingLevel, 2],
    [remarkLintNoHtml, false]
  ]
}

export default config
