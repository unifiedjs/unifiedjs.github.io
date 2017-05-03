'use strict';

var fs = require('fs');
var strip = require('strip-comments');

var personal = strip(fs.readFileSync('dictionary.txt', 'utf8'));

exports.plugins = [
  require('retext-english'),
  require('retext-contractions'),
  require('retext-diacritics'),
  require('retext-equality'),
  require('retext-indefinite-article'),
  require('retext-passive'),
  require('retext-profanities'),
  [require('retext-readability'), {age: 18, minWords: 8}],
  require('retext-redundant-acronyms'),
  require('retext-repeated-words'),
  [require('retext-sentence-spacing'), {preferred: 2}],
  [require('retext-simplify'), {ignore: ['function', 'interface', 'maintain']}],
  require('retext-syntax-mentions'),
  [
    require('retext-spell'),
    {dictionary: require('dictionary-en-gb'), personal: personal}
  ],
  [require('retext-quotes')]
];
