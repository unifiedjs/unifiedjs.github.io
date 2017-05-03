'use strict';

exports.plugins = [
  [require('rehype-retext'), require('../natural-language')()],
  require('rehype-slug'),
  require('rehype-highlight'),
  require('./plugin/link'),
  require('./plugin/abbreviate'),
  require('rehype-format')
];
