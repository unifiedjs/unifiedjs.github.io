exports.plugins = [
  require('remark-preset-wooorm'),
  [require('remark-retext'), require('../natural-language')()],
  [require('remark-validate-links'), false],
  [require('remark-lint-first-heading-level'), 2],
  [require('remark-toc'), {heading: 'contents', depth: 3, tight: true}]
];
