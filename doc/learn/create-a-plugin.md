---
group: guide
title: Create a plugin
description: Guide that shows how to create a (retext) plugin
author: Titus Wormer
authorTwitter: wooorm
tags:
  - plugin
  - retext
published: 2017-05-03
modified: 2019-12-12
---

## Creating a plugin with unified

This guide shows how to create a plugin for retext that checks the amount of
spaces between sentences.
The concepts here apply to the other syntaxes of unified as well.

> Stuck?
> A good place to get help fast is [Spectrum][].
> Have an idea for another guide?
> Share it on spectrum!

### Contents

*   [Plugin basics](#plugin-basics)
*   [Case](#case)
*   [Setting up](#setting-up)
*   [Plugin](#plugin)
*   [Further exercises](#further-exercises)

### Plugin basics

A unified plugin changes the way the applied-on processor works, in several
ways.
In this guide we’ll review how to inspect syntax trees.

Plugins can contain two parts: an **attacher**, which is a function that is
invoked when someone calls `.use`, and a **transformer**, which is an optional
function invoked each time a file is processed with a syntax tree and a virtual
file.

In this case, we want to check the syntax tree of each processed file, so we do
specify a transformer.

Now you know the basics of plugins in unified.
On to our case!

### Case

Before we start, let’s first outline what we want to make.
Say we have the following text file:

```markdown
One sentence. Two sentences.

One sentence.  Two sentences.
```

We want to get a warning for the second paragraph, saying that one space instead
of two spaces should be used.

In the next step we’ll write the code to use our plugin.

### Setting up

Now, let’s create an `example.js` file that will process our text file and
report any found problems.

```javascript
var fs = require('fs')
var retext = require('retext')
var report = require('vfile-reporter')
var spacing = require('.')

var doc = fs.readFileSync('example.md')

retext()
  .use(spacing)
  .process(doc, function(err, file) {
    console.error(report(err || file))
  })
```

> Don’t forget to `npm install` dependencies!

If you read the guide on [using unified][use], you’ll see some familiar
statements.
First, we load dependencies, then we read the file in.
We process that file with the plugin we’ll create in a second, and finally we
report either a fatal error or any found linting messages.

Note that we directly depend on retext.
This is a package that exposes a unified processor, and comes with the parser
and compiler attached.

When running our example (it doesn’t work yet though) we want to see a message
for the second paragraph, saying that one space instead of two spaces should be
used.

Now we’ve got everything set up except for the plugin itself.
We’ll do that in the next section.

### Plugin

As we read in Plugin Basics, we’ll need an attacher, and for our case also a
transformer.
Let’s create them in our plugin file `index.js`:

```javascript
module.exports = attacher

function attacher() {
  return transformer

  function transformer(tree, file) {
  }
}
```

First things first, we need to check `tree` for a pattern.
We can use a utility to help us to recursively walk our tree, namely
[`unist-util-visit`][visit].
Let’s add that.

```diff
+var visit = require('unist-util-visit')
+
module.exports = attacher

function attacher() {
  return transformer

  function transformer(tree, file) {
+    visit(tree, 'ParagraphNode', visitor)
+
+    function visitor(node) {
+      console.log(node)
+    }
  }
}
```

> Don’t forget to `npm install` the utility!

If we now run our example with Node.js, as follows, we’ll see that visitor is
invoked with both paragraphs in our example:

```sh
$ node example.js
{ type: 'ParagraphNode',
  children:
  [ { type: 'SentenceNode', children: [Object] },
   { type: 'WhiteSpaceNode', value: ' ' },
   { type: 'SentenceNode', children: [Object] } ] }
{ type: 'ParagraphNode',
  children:
  [ { type: 'SentenceNode', children: [Object] },
   { type: 'WhiteSpaceNode', value: '  ' },
   { type: 'SentenceNode', children: [Object] } ] }
no issues found
```

This output already shows that paragraphs contain two types of nodes:
`SentenceNode` and `WhiteSpaceNode`.
The latter is what we want to check, but the former is important because we only
warn about white-space between sentences in this plugin (that could be another
plugin though).

Let’s now loop through the children of each paragraph.
Only checking white-space between sentences.
We use a small utility for checking node types: [`unist-util-is`][is].

```diff
var visit = require('unist-util-visit')
+var is = require('unist-util-is')

module.exports = attacher

function attacher() {
  return transformer

  function transformer(tree, file) {
    visit(tree, 'ParagraphNode', visitor)

    function visitor(node) {
-      console.log(node)
+      var children = node.children
+
+      children.forEach(function(child, index) {
+        if (
+          is(children[index - 1], 'SentenceNode') &&
+          is(child, 'WhiteSpaceNode') &&
+          is(children[index + 1], 'SentenceNode')
+        ) {
+          console.log(child)
+        }
+      })
    }
  }
}
```

> Don’t forget to `npm install` the utility!

If we now run our example with Node, as follows, we’ll see that only white-space
between sentences is logged.

```sh
$ node example.js
{ type: 'WhiteSpaceNode', value: ' ' }
{ type: 'WhiteSpaceNode', value: '  ' }
no issues found
```

Finally, let’s add a warning for the second white-space, as it has more
characters than needed.
We can use [`file.message()`][message] to associate a message with the file.

```diff
var visit = require('unist-util-visit')
var is = require('unist-util-is')

module.exports = attacher

function attacher() {
  return transformer

  function transformer(tree, file) {
    visit(tree, 'ParagraphNode', visitor)

    function visitor(node) {
      var children = node.children

      children.forEach(function(child, index) {
        if (
          is('SentenceNode', children[index - 1]) &&
          is('WhiteSpaceNode', child) &&
          is('SentenceNode', children[index + 1])
        ) {
-          console.log(child)
+          if (child.value.length !== 1) {
+            file.message(
+              'Expected 1 space between sentences, not ' + child.value.length,
+              child
+            )
+          }
        }
      })
    }
  }
}
```

If we now run our example one final time, we’ll see a message for our problem!

```sh
$ node example.js
3:14-3:16  warning  Expected 1 space between sentences, not 2

⚠ 1 warning
```

### Further exercises

One space between sentences isn’t for everyone.
This plugin could receive the preferred amount of spaces instead of a hard-coded
`1`.

If you want to warn for tabs or newlines between sentences, maybe create a
plugin for that too?

If you haven’t already, check out the other articles in the
[learn section][learn]!

<!--Definitions-->

[spectrum]: https://spectrum.chat/unified

[visit]: https://github.com/syntax-tree/unist-util-visit

[is]: https://github.com/syntax-tree/unist-util-is

[message]: https://github.com/vfile/vfile#vfilemessagereason-position-origin

[learn]: /learn/

[use]: /learn/guide/using-unified/
