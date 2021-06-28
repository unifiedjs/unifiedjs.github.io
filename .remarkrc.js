import fs from 'fs'
import strip from 'strip-comments'
import dictionaryEn from 'dictionary-en'
import unified from 'unified'
import retextEnglish from 'retext-english'
import retextPresetWooorm from 'retext-preset-wooorm'
import retextEquality from 'retext-equality'
import retextPassive from 'retext-passive'
import retextProfanities from 'retext-profanities'
import retextReadability from 'retext-readability'
import retextSimplify from 'retext-simplify'
import retextEmoji from 'retext-emoji'
import retextSyntaxMentions from 'retext-syntax-mentions'
import retextSyntaxUrls from 'retext-syntax-urls'
import retextSpell from 'retext-spell'
import remarkPresetWooorm from 'remark-preset-wooorm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkRetext from 'remark-retext'
import remarkValidateLinks from 'remark-validate-links'
import remarkLintNoDeadUrls from 'remark-lint-no-dead-urls'
import remarkLintFirstHeadingLevel from 'remark-lint-first-heading-level'
import remarkLintNoHtml from 'remark-lint-no-html'

var personal = strip(fs.readFileSync('dictionary.txt', 'utf8'))

var naturalLanguage = unified().use([
  retextEnglish,
  retextPresetWooorm,
  [retextEquality, {ignore: ['whitespace']}],
  retextPassive,
  [retextProfanities, {sureness: 1}],
  [retextReadability, {age: 18, minWords: 8}],
  [retextSimplify, {ignore: ['function', 'interface', 'maintain']}],
  retextEmoji,
  retextSyntaxMentions,
  retextSyntaxUrls,
  [retextSpell, {dictionary: dictionaryEn, personal: personal}]
])

const config = {
  plugins: [
    remarkPresetWooorm,
    remarkFrontmatter,
    [remarkRetext, naturalLanguage],
    [remarkValidateLinks, false],
    [remarkLintNoDeadUrls, 'https://unifiedjs.com'],
    [remarkLintFirstHeadingLevel, 2],
    [remarkLintNoHtml, false]
  ]
}

export default config
