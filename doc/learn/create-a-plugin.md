---
group: guide
title: Create a plugin
description: Guide that shows how to create a (retext) plugin
author: Titus Wormer
authorTwitter: wooorm
authorGithub: wooorm
tags:
  - plugin
  - retext
published: 2017-05-03
modified: 2020-05-18
---

## Creating a plugin with unified

This guide shows how to create a plugin for retext that checks the amount of
spaces between sentences.
The concepts here apply to the other syntaxes of unified as well.

> Stuck?
> Have an idea for another guide?
> See [`support.md`][support].

### Contents

* [Plugin basics](#plugin-basics)
* [Case](#case)
* [Setting up](#setting-up)
* [Plugin](#plugin)
* [Further exercises](#further-exercises)

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

Let’s set up a project.
Create a folder, `example`, enter it, and initialize a new project:

```sh
mkdir example
cd example
npm init -y
```

Then make sure the project is a module, so that `import` and `export` work,
by changing `package.json`:

```diff
--- a/package.json
+++ b/package.json
@@ -2,6 +2,7 @@
   "name": "example",
   "version": "1.0.0",
   "description": "",
+  "type": "module",
   "main": "index.js",
   "scripts": {
     "test": "echo \"Error: no test specified\" && exit 1"
```

Make sure `example.md` exists with:

```markdown
One sentence. Two sentences.

One sentence.  Two sentences.
```

Now, let’s create an `example.js` file that will process our text file and
report any found problems.

```javascript
import fs from 'fs'
import {retext} from 'retext'
import {reporter} from 'vfile-reporter'
import retextSentenceSpacing from './index.js'

const buffer = fs.readFileSync('example.md')

retext()
  .use(retextSentenceSpacing)
  .process(buffer)
  .then((file) => {
    console.error(reporter(file))
  })
```

> Don’t forget to `npm install` dependencies (`retext`, `vfile-reporter`)!

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

As we read in Plugin Basics, we’ll need a plugin, and for our case also a
transformer.
Let’s create them in our plugin file `index.js`:

```javascript
export default function retextSentenceSpacing() {
  return (tree, file) => {
  }
}
```

First things first, we need to check `tree` for a pattern.
We can use a utility to help us to recursively walk our tree, namely
[`unist-util-visit`][visit].
Let’s add that.

```diff
--- a/index.js
+++ b/index.js
@@ -1,4 +1,9 @@
+import {visit} from 'unist-util-visit'
+
 export default function retextSentenceSpacing() {
   return (tree, file) => {
+    visit(tree, 'ParagraphNode', (node) => {
+      console.log(node)
+    })
   }
 }
```

> Don’t forget to `npm install` the utility!

If we now run our example with Node.js, as follows, we’ll see that visitor is
invoked with both paragraphs in our example:

```sh
node example.js
```

```txt
{
  type: 'ParagraphNode',
  children: [
    { type: 'SentenceNode', children: [Array], position: [Object] },
    { type: 'WhiteSpaceNode', value: ' ', position: [Position] },
    { type: 'SentenceNode', children: [Array], position: [Object] }
  ],
  position: {
    start: { line: 1, column: 1, offset: 0 },
    end: { line: 1, column: 29, offset: 28 }
  }
}
{
  type: 'ParagraphNode',
  children: [
    { type: 'SentenceNode', children: [Array], position: [Object] },
    { type: 'WhiteSpaceNode', value: '  ', position: [Position] },
    { type: 'SentenceNode', children: [Array], position: [Object] }
  ],
  position: {
    start: { line: 3, column: 1, offset: 30 },
    end: { line: 3, column: 30, offset: 59 }
  }
}
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
--- a/index.js
+++ b/index.js
@@ -1,9 +1,20 @@
 import {visit} from 'unist-util-visit'
+import {is} from 'unist-util-is'

 export default function retextSentenceSpacing() {
   return (tree, file) => {
     visit(tree, 'ParagraphNode', (node) => {
-      console.log(node)
+      const children = node.children
+
+      children.forEach((child, index) => {
+        if (
+          is(children[index - 1], 'SentenceNode') &&
+          is(child, 'WhiteSpaceNode') &&
+          is(children[index + 1], 'SentenceNode')
+        ) {
+          console.log(child)
+        }
+      })
     })
   }
 }
```

> Don’t forget to `npm install` the utility!

If we now run our example with Node, as follows, we’ll see that only white-space
between sentences is logged.

```sh
node example.js
```

```txt
{
  type: 'WhiteSpaceNode',
  value: ' ',
  position: Position {
    start: { line: 1, column: 14, offset: 13 },
    end: { line: 1, column: 15, offset: 14 }
  }
}
{
  type: 'WhiteSpaceNode',
  value: '  ',
  position: Position {
    start: { line: 3, column: 14, offset: 43 },
    end: { line: 3, column: 16, offset: 45 }
  }
}
no issues found
```

Finally, let’s add a warning for the second white-space, as it has more
characters than needed.
We can use [`file.message()`][message] to associate a message with the file.

```diff
--- a/index.js
+++ b/index.js
@@ -12,7 +12,12 @@ export default function retextSentenceSpacing() {
           is(child, 'WhiteSpaceNode') &&
           is(children[index + 1], 'SentenceNode')
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
     })
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

[support]: https://github.com/unifiedjs/.github/blob/main/support.md

[visit]: https://github.com/syntax-tree/unist-util-visit

[is]: https://github.com/syntax-tree/unist-util-is

[message]: https://github.com/vfile/vfile#vfilemessagereason-position-origin

[learn]: /learn/

[use]: /learn/guide/using-unified/
