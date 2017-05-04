var h = require('hastscript');

module.exports = section;

function section() {
  return transform;
  function transform(tree) {
    tree.children.push(
      h('footer', [
        h('p', [
          'made by ',
          h('a', {href: 'https://github.com/wooorm'}, '@wooorm'),
          ' and ',
          h('a', {
            href: 'https://github.com/unifiedjs/unifiedjs.github.io/graphs/contributors'
          }, 'contributors')
        ]),
        h('p', [
          'view the project on ',
          h('a', {href: 'https://github.com/unifiedjs/unified'}, 'GitHub')
        ]),
        h('p', '☔')
      ])
    );
  }
}
