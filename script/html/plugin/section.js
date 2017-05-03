var h = require('hastscript');

module.exports = section;

function section() {
  return transform;
  function transform(tree) {
    var result = [];
    var section;
    var article;

    tree.children.forEach(function (child) {
      var ctx;

      if (child.tagName === 'h2') {
        ctx = result;
        article = null;
        child = h('section', [child]);
        section = child;
      } else if (child.tagName === 'h3') {
        ctx = section ? section.children : result;
        child = h('article', [child]);
        article = child;
      } else {
        ctx = (article || section || {}).children || result;
      }

      ctx.push(child);
    });

    tree.children = [h('main', result)];
  }
}
