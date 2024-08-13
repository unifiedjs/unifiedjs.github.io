---
authorGithub: wooorm
authorTwitter: wooorm
author: Titus Wormer
description: Guide that shows how to create a rehype plugin
group: guide
modified: 2024-08-13
published: 2024-08-13
tags:
  - hast
  - plugin
  - rehype
title: Create a rehype plugin
---

## Create a rehype plugin

This guide shows how to create a plugin for rehype that adds `id` attributes to
headings.

> Stuck?
> Have an idea for another guide?
> See [`support.md`][support].

### Contents

* [Case](#case)
* [Setting up](#setting-up)
* [Plugin](#plugin)

### Case

Before we start, let’s first outline what we want to make.
Say we have the following file:

```html
<h1>Solar System</h1>
<h2>Formation and evolution</h2>
<h2>Structure and composition</h2>
<h3>Orbits</h3>
<h3>Composition</h3>
<h3>Distances and scales</h3>
<h3>Interplanetary environment</h3>
<p>…</p>
```

And we’d like to turn that into:

```html
<h1 id="solar-system">Solar System</h1>
<h2 id="formation-and-evolution">Formation and evolution</h2>
<h2 id="structure-and-composition">Structure and composition</h2>
<h3 id="orbits">Orbits</h3>
<h3 id="composition">Composition</h3>
<h3 id="distances-and-scales">Distances and scales</h3>
<h3 id="interplanetary-environment">Interplanetary environment</h3>
<p>…</p>
```

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

Make sure `input.html` exists with:

```html
<h1>Solar System</h1>
<h2>Formation and evolution</h2>
<h2>Structure and composition</h2>
<h3>Orbits</h3>
<h3>Composition</h3>
<h3>Distances and scales</h3>
<h3>Interplanetary environment</h3>
<p>…</p>
```

Now, let’s create an `example.js` file that will process our file and report
any found problems.

```js twoslash
// @filename: plugin.d.ts
import type {Root} from 'hast'
export default function rehypeSlug(): (tree: Root) => undefined;
// @filename: example.js
/// <reference types="node" />
// ---cut---
import fs from 'node:fs/promises'
import {rehype} from 'rehype'
import rehypeSlug from './plugin.js'

const document = await fs.readFile('input.html', 'utf8')

const file = await rehype()
  .data('settings', {fragment: true})
  .use(rehypeSlug)
  .process(document)

await fs.writeFile('output.html', String(file))
```

> Don’t forget to `npm install rehype`!

If you read the guide on [using unified][use],
you’ll see some familiar statements.
First,
we load dependencies,
then we read the file in.
We process that file with the plugin we’ll create next and finally we write
it out again.

Note that we directly depend on `rehype`.
This is a package that exposes a `unified` processor,
and comes with the HTML parser and HTML compiler attached.

Now we’ve got everything set up except for the plugin itself.
We’ll do that in the next section.

### Plugin

We’ll need a plugin and for our case also a transform.
Let’s create them in our plugin file `plugin.js`:

```js twoslash
/**
 * @import {Root} from 'hast'
 */

/**
 * Add `id`s to headings.
 *
 * @returns
 *   Transform.
 */
export default function rehypeSlug() {
  /**
   * @param {Root} tree
   * @return {undefined}
   */
  return function (tree) {
  }
}
```

That’s how most plugins start.
A function that returns another function.

Next,
for this use case,
we can walk the tree and change nodes with
[`unist-util-visit`][visit].
That’s how many plugins work.

Let’s start there,
to use `unist-util-visit` to look for headings:

```diff
--- a/plugin.js
+++ b/plugin.js
@@ -2,6 +2,8 @@
  * @import {Root} from 'hast'
  */

+import {visit} from 'unist-util-visit'
+
 /**
  * Add `id`s to headings.
  *
@@ -14,5 +16,17 @@ export default function rehypeSlug() {
    * @return {undefined}
    */
   return function (tree) {
+    visit(tree, 'element', function (node) {
+      if (
+        node.tagName === 'h1' ||
+        node.tagName === 'h2' ||
+        node.tagName === 'h3' ||
+        node.tagName === 'h4' ||
+        node.tagName === 'h5' ||
+        node.tagName === 'h6'
+      ) {
+        console.log(node)
+      }
+    })
   }
 }
```

> Don’t forget to `npm install unist-util-visit`!

If we now run our example with Node.js,
we’ll see that `console.log` is called:

```sh
node example.js
```

```txt
{
  type: 'element',
  tagName: 'h1',
  properties: {},
  children: [ { type: 'text', value: 'Solar System', position: [Object] } ],
  position: …
}
{
  type: 'element',
  tagName: 'h2',
  properties: {},
  children: [
    {
      type: 'text',
      value: 'Formation and evolution',
      position: [Object]
    }
  ],
  position: …
}
…
```

This output shows that we find our heading element.
That’s what we want.

Next we want to get a string representation of what is inside the headings.
There’s another utility for that:
[`hast-util-to-string`][hast-util-to-string].

```diff
--- a/plugin.js
+++ b/plugin.js
@@ -2,6 +2,7 @@
  * @import {Root} from 'hast'
  */

+import {toString} from 'hast-util-to-string'
 import {visit} from 'unist-util-visit'

 /**
@@ -25,7 +26,8 @@ export default function rehypeSlug() {
         node.tagName === 'h5' ||
         node.tagName === 'h6'
       ) {
-        console.log(node)
+        const value = toString(node)
+        console.log(value)
       }
     })
   }
```

> Don’t forget to `npm install hast-util-to-string`!

If we now run our example with Node.js,
we’ll see the text printed:

```sh
node example.js
```

```txt
Solar System
Formation and evolution
Structure and composition
Orbits
Composition
Distances and scales
Interplanetary environment
```

Then we want to turn that text into slugs.
You have many options here.
For this case,
we’ll use [`github-slugger`][github-slugger].

```diff
--- a/plugin.js
+++ b/plugin.js
@@ -3,6 +3,7 @@
  */

 import {toString} from 'hast-util-to-string'
+import Slugger from 'github-slugger'
 import {visit} from 'unist-util-visit'

 /**
@@ -17,6 +18,8 @@ export default function rehypeSlug() {
    * @return {undefined}
    */
   return function (tree) {
+    const slugger = new Slugger()
+
     visit(tree, 'element', function (node) {
       if (
         node.tagName === 'h1' ||
@@ -27,7 +30,8 @@ export default function rehypeSlug() {
         node.tagName === 'h6'
       ) {
         const value = toString(node)
-        console.log(value)
+        const id = slugger.slug(value)
+        console.log(id)
       }
     })
   }
```

> Don’t forget to `npm install github-slugger`!

The reason `const slugger = new Slugger()` is there,
is because we want to create a new slugger for each document.
If we’d create it outside of the function,
we’d reuse the same slugger for each document,
which would lead to slugs from different documents being mixed.
That becomes a problem for documents with the same headings.

If we now run our example with Node.js,
we’ll see the slugs printed:

```sh
node example.js
```

```txt
solar-system
formation-and-evolution
structure-and-composition
orbits
composition
distances-and-scales
interplanetary-environment
```

Finally,
we want to add the `id` to the heading elements.
This is also a good time to make sure we don’t overwrite existing `id`s.

```diff
--- a/plugin.js
+++ b/plugin.js
@@ -22,16 +22,17 @@ export default function rehypeSlug() {

     visit(tree, 'element', function (node) {
       if (
-        node.tagName === 'h1' ||
-        node.tagName === 'h2' ||
-        node.tagName === 'h3' ||
-        node.tagName === 'h4' ||
-        node.tagName === 'h5' ||
-        node.tagName === 'h6'
+        !node.properties.id &&
+        (node.tagName === 'h1' ||
+          node.tagName === 'h2' ||
+          node.tagName === 'h3' ||
+          node.tagName === 'h4' ||
+          node.tagName === 'h5' ||
+          node.tagName === 'h6')
       ) {
         const value = toString(node)
         const id = slugger.slug(value)
-        console.log(id)
+        node.properties.id = id
       }
     })
   }
```

If we now run our example again with Node…

```sh
node example.js
```

…and open `output.html`,
we’ll see that the IDs are there!

```html
<h1 id="solar-system">Solar System</h1>
<h2 id="formation-and-evolution">Formation and evolution</h2>
<h2 id="structure-and-composition">Structure and composition</h2>
<h3 id="orbits">Orbits</h3>
<h3 id="composition">Composition</h3>
<h3 id="distances-and-scales">Distances and scales</h3>
<h3 id="interplanetary-environment">Interplanetary environment</h3>
<p>…</p>
```

That’s it!
For a complete version of this plugin,
see [`rehype-slug`][rehype-slug].

If you haven’t already, check out the other articles in the
[learn section][learn]!

<!--Definitions-->

[support]: https://github.com/unifiedjs/.github/blob/main/support.md

[hast-util-to-string]: https://github.com/rehypejs/rehype-minify/tree/main/packages/hast-util-to-string

[github-slugger]: https://github.com/Flet/github-slugger

[visit]: https://github.com/syntax-tree/unist-util-visit

[rehype-slug]: https://github.com/rehypejs/rehype-slug

[learn]: /learn/

[use]: /learn/guide/using-unified/
