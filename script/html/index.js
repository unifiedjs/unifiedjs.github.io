'use strict';

var unified = require('unified');
var parse = require('rehype-parse');
var stringify = require('rehype-stringify');
var preset = require('./preset');

module.exports = unified().use(parse).use(preset).use(stringify).freeze();

module.exports.extname = '.html';
