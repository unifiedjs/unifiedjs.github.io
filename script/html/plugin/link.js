var h = require('hastscript');
var findAndReplace = require('hast-util-find-and-replace');

module.exports = link;

var replacements = initialise();

var ignore = findAndReplace.ignore.concat([
  'a',
  'pre',
  'code',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6'
]);

function link() {
  return transform;

  function transform(tree) {
    findAndReplace(tree, replacements, {ignore: ignore});
  }
}

function initialise() {
  var result = {};
  var dictionary = {
    'v|file': 'vfile/vfile',
    're|mark': 'remarkjs/remark',
    're|text': 'retextjs/retext',
    're|hype': 'rehypejs/rehype',
    'uni|st': 'syntax-tree/unist',
    'nl|cst': 'syntax-tree/nlcst',
    'md|ast': 'syntax-tree/mdast',
    'h|ast': 'syntax-tree/hast'
  };

  Object.keys(dictionary).forEach(add);

  return result;

  function add(find) {
    var parts = find.split('|');
    var name = parts.join('');
    var slug = dictionary[find];

    result[name] = replacer;

    function replacer() {
      return h('a', {href: 'https://github.com/' + slug}, [
        h('span.hl.' + name, parts[0]),
        parts[1]
      ]);
    }
  }
}
