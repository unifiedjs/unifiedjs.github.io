---
authorGithub: wooorm
author: Titus Wormer
description: Guide that shows how to create a retext plugin
group: guide
modified: 2024-08-13
published: 2024-08-13
tags:
  - nlcst
  - plugin
  - retext
title: Create a retext plugin
---

## Create a retext plugin

This guide shows how to create a plugin for retext that checks the amount of
spaces between sentences.

> Stuck?
> Have an idea for another guide?
> See [`support.md`][support].

### Contents

* [Case](#case)
* [Setting up](#setting-up)
* [Plugin](#plugin)
* [Further exercises](#further-exercises)

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
@@ -1,6 +1,7 @@
 {
   "name": "example",
   "version": "1.0.0",
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

```js twoslash
// @filename: plugin.d.ts
import type {Root} from 'nlcst'
import type {VFile} from 'vfile'
export default function retextSentenceSpacing(): (tree: Root, file: VFile) => undefined;
// @filename: example.js
/// <reference types="node" />
// ---cut---
import fs from 'node:fs/promises'
import {retext} from 'retext'
import {reporter} from 'vfile-reporter'
import retextSentenceSpacing from './plugin.js'

const document = await fs.readFile('example.md', 'utf8')

const file = await retext()
  .use(retextSentenceSpacing)
  .process(document)

console.error(reporter(file))
```

> Don’t forget to `npm install retext vfile-reporter`!

If you read the guide on [using unified][use],
you’ll see some familiar statements.
First,
we load dependencies,
then we read the file in.
We process that file with the plugin we’ll create next and finally we report
either a fatal error or any found linting messages.

Note that we directly depend on `retext`.
This is a package that exposes a `unified` processor,
and comes with the parser and compiler attached.

When running our example (it doesn’t work yet though) we want to see a message
for the second paragraph, saying that one space instead of two spaces should be
used.

Now we’ve got everything set up except for the plugin itself.
We’ll do that in the next section.

### Plugin

We’ll need a plugin, and for our case also a transform which will inspect.
Let’s create them in our plugin file `plugin.js`:

```js twoslash
/**
 * @import {Root} from 'nlcst'
 * @import {VFile} from 'vfile'
 */

export default function retextSentenceSpacing() {
  /**
   * @param {Root} tree
   * @param {VFile} file
   * @return {undefined}
   */
  return function (tree, file) {
  }
}
```

First things first, we need to check `tree` for a pattern.
We can use a utility to help us to recursively walk our tree, namely
[`unist-util-visit`][visit].
Let’s add that.

```diff
--- a/plugin.js
+++ b/plugin.js
@@ -3,6 +3,8 @@
  * @import {VFile} from 'vfile'
  */

+import {visit} from 'unist-util-visit'
+
 export default function retextSentenceSpacing() {
   /**
    * @param {Root} tree
@@ -10,5 +12,8 @@ export default function retextSentenceSpacing() {
    * @return {undefined}
    */
   return function (tree, file) {
+    visit(tree, 'ParagraphNode', function (node) {
+      console.log(node)
+    })
   }
 }
```

> Don’t forget to `npm install unist-util-visit`.

If we now run our example with Node.js, as follows, we’ll see that visitor is
called with both paragraphs in our example:

```sh
node example.js
```

```txt
{
  type: 'ParagraphNode',
  children: [
    { type: 'SentenceNode', children: [Array], position: [Object] },
    { type: 'WhiteSpaceNode', value: ' ', position: [Object] },
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
    { type: 'WhiteSpaceNode', value: '  ', position: [Object] },
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
warn about whitespace between sentences in this plugin (that could be another
plugin though).

Let’s now loop through the children of each paragraph.
Only checking whitespace between sentences.
We use a small utility for checking node types: [`unist-util-is`][is].

```diff
--- a/plugin.js
+++ b/plugin.js
@@ -13,7 +13,23 @@ export default function retextSentenceSpacing() {
    */
   return function (tree, file) {
     visit(tree, 'ParagraphNode', function (node) {
-      console.log(node)
+      let index = -1
+
+      while (++index < node.children.length) {
+        const previous = node.children[index - 1]
+        const child = node.children[index]
+        const next = node.children[index + 1]
+
+        if (
+          previous &&
+          next &&
+          previous.type === 'SentenceNode' &&
+          child.type === 'WhiteSpaceNode' &&
+          next.type === 'SentenceNode'
+        ) {
+          console.log(child)
+        }
+      }
     })
   }
 }
```

If we now run our example with Node, as follows, we’ll see that only whitespace
between sentences is logged.

```sh
node example.js
```

```txt
{
  type: 'WhiteSpaceNode',
  value: ' ',
  position: {
    start: { line: 1, column: 14, offset: 13 },
    end: { line: 1, column: 15, offset: 14 }
  }
}
{
  type: 'WhiteSpaceNode',
  value: '  ',
  position: {
    start: { line: 3, column: 14, offset: 43 },
    end: { line: 3, column: 16, offset: 45 }
  }
}
no issues found
```

Finally, let’s add a warning for the second whitespace, as it has more
characters than needed.
We can use [`file.message()`][message] to associate a message with the file.

```diff
--- a/plugin.js
+++ b/plugin.js
@@ -25,9 +25,15 @@ export default function retextSentenceSpacing() {
           next &&
           previous.type === 'SentenceNode' &&
           child.type === 'WhiteSpaceNode' &&
-          next.type === 'SentenceNode'
+          next.type === 'SentenceNode' &&
+          child.value.length !== 1
         ) {
-          console.log(child)
+          file.message(
+            'Unexpected `' +
+              child.value.length +
+              '` spaces between sentences, expected `1` space',
+            child
+          )
         }
       }
     })
```

If we now run our example one final time, we’ll see a message for our problem!

```sh
$ node example.js
3:14-3:16 warning Unexpected `2` spaces between sentences, expected `1` space

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

[message]: https://github.com/vfile/vfile#vfilemessagereason-options

[learn]: /learn/

[use]: /learn/guide/using-unified/
