var unified = require('unified');
var parse = require('remark-parse');
var stringify = require('rehype-stringify');
var markdown = require('./preset-md');
var html = require('./preset-html');

module.exports = unified().use(parse).use(markdown).use(html).use(stringify).freeze();

module.exports.extname = '.html';
