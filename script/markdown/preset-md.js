exports.plugins = [
  require('remark-preset-wooorm'),
  [require('remark-retext'), require('../natural-language')()],
  [require('remark-validate-links'), false],
  [require('remark-lint-no-dead-urls'), 'https://unifiedjs.com'],
  [require('remark-lint-first-heading-level'), 2],
  [require('remark-toc'), {heading: 'contents', maxDepth: 2, tight: true}]
]
