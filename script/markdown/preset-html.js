exports.plugins = [
  require('./plugin/highlight'),
  [require('remark-rehype'), {allowDangerousHTML: true}],
  require('rehype-raw'),
  require('../html/plugin/section'),
  require('rehype-slug'),
  [
    require('rehype-autolink-headings'),
    {
      properties: {
        className: ['anchor']
      },
      content: {type: 'text', value: '#'}
    }
  ],
  require('./plugin/prefix'),
  require('./plugin/suffix'),
  require('../html/plugin/link'),
  require('../html/plugin/abbreviate'),
  [
    require('rehype-document'),
    {
      title: 'unified',
      css: 'index.css',
      js: 'index.js'
    }
  ],
  require('rehype-preset-minify')
]
