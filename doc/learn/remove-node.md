---
authorGithub: wooorm
author: Titus Wormer
description: How to remove nodes in any unist tree
group: recipe
index: 7
modified: 2024-08-02
published: 2020-06-15
tags:
  - delete
  - node
  - remove
  - traverse
  - tree
  - walk
title: Remove a node
---

## How to remove a node

Once you have found the node(s) you want to remove
(see [tree traversal][tree-traversal]),
you can remove them.

### Contents

* [Prerequisites](#prerequisites)
* [Removing a node](#removing-a-node)
* [Replacing a node with its children](#replacing-a-node-with-its-children)

### Prerequisites

* [Tree traversal][tree-traversal]
  — intro on how to walk trees and find specific nodes with `unist-util-visit`

### Removing a node

For the most part, removing nodes has to do with finding them first (see [tree
traversal][tree-traversal]), so let’s say we already have some code to find all
`emphasis` nodes.

First, our `example.md` file:

```md
Some text with *emphasis*.

Another paragraph with **importance** (and *more emphasis*).
```

And a module, `example.js`:

```js twoslash
/// <reference types="node" />
// ---cut---
import fs from 'node:fs/promises'
import remarkParse from 'remark-parse'
import {unified} from 'unified'
import {visit} from 'unist-util-visit'

const document = await fs.readFile('example.md', 'utf8')

const tree = unified().use(remarkParse).parse(document)

visit(tree, 'emphasis', function (node) {
  console.log(node)
})
```

Now, running `node example.js` yields (ignoring positions for brevity):

```js
{
  type: 'emphasis',
  children: [ { type: 'text', value: 'emphasis', position: [Object] } ]
}
{
  type: 'emphasis',
  children: [ { type: 'text', value: 'more emphasis', position: [Object] } ]
}
```

As the above log shows, nodes are objects.
Each node is inside an array at the `children` property of another node.
In other words, to remove a node, it must be removed from its parents
`children`.

The problem then is to remove a value from an array.
Standard JavaScript [Array functions][array] can be used: namely,
[`splice`][splice].

We have the emphasis nodes, but we don’t have their parent, or the position in
the parent’s `children` field they are in.
Luckily, the function given to `visit` gets not only `node`, but also that
`index` and `parent`:

```diff
--- a/example.js
+++ b/example.js
@@ -7,6 +7,6 @@ const document = await fs.readFile('example.md', 'utf8')

 const tree = unified().use(remarkParse).parse(document)

-visit(tree, 'emphasis', function (node) {
-  console.log(node)
+visit(tree, 'emphasis', function (node, index, parent) {
+  console.log(node.type, index, parent?.type)
 })
```

Yields:

```txt
emphasis 1 paragraph
emphasis 3 paragraph
```

`parent` is a reference to the parent of `node`, `index` is the position
at which `node` is in `parent`’s `children`.
With this information, and `splice`, we can now remove emphasis nodes:

```diff
--- a/example.js
+++ b/example.js
@@ -8,5 +8,9 @@ const document = await fs.readFile('example.md', 'utf8')
 const tree = unified().use(remarkParse).parse(document)

 visit(tree, 'emphasis', function (node, index, parent) {
-  console.log(node.type, index, parent?.type)
+  if (typeof index !== 'number' || !parent) return
+  // Note: this is buggy, see next section.
+  parent.children.splice(index, 1)
 })
+
+console.log(tree)
```

Yields:

```js
{
  type: 'root',
  children: [
    {
      type: 'paragraph',
      children: [
        {type: 'text', value: 'Some text with '},
        {type: 'text', value: '.'}
      ]
    },
    {
      type: 'paragraph',
      children: [
        {type: 'text', value: 'Another paragraph with '},
        {type: 'strong', children: [Array]},
        {type: 'text', value: ' (and '},
        {type: 'text', value: ').'}
      ]
    }
  ]
}
```

This looks great, but beware of bugs.
We are now changing the tree, while traversing it.
That can cause bugs and performance problems.

When changing the tree, in most cases you should signal to `visit` how it should
continue.
More information on how to signal what to do next, is documented in
[`unist-util-visit-parents`][visit-parents].

In this case, we don’t want the removed node to be traversed (we want to skip
it).
And we want to continue with the node that is now at the position where our
removed node was.
To do that: return that information from `visitor`:

```diff
--- a/example.js
+++ b/example.js
@@ -1,7 +1,7 @@
 import fs from 'node:fs/promises'
 import remarkParse from 'remark-parse'
 import {unified} from 'unified'
-import {visit} from 'unist-util-visit'
+import {SKIP, visit} from 'unist-util-visit'

 const document = await fs.readFile('example.md', 'utf8')

@@ -9,8 +9,9 @@ const tree = unified().use(remarkParse).parse(document)

 visit(tree, 'emphasis', function (node, index, parent) {
   if (typeof index !== 'number' || !parent) return
-  // Note: this is buggy, see next section.
   parent.children.splice(index, 1)
+  // Do not traverse `node`, continue at the node *now* at `index`.
+  return [SKIP, index]
 })

 console.log(tree)
```

This yields the same output as before, but there’s no bug anymore.
Nice, we can now remove nodes!

### Replacing a node with its children

One more thing to make this example more useful: instead of dropping `emphasis`
*and* its children, it might make more sense to replace the emphasis *with* its
children.

To do that, we can do the following:

```diff
--- a/example.js
+++ b/example.js
@@ -9,7 +9,7 @@ const tree = unified().use(remarkParse).parse(document)

 visit(tree, 'emphasis', function (node, index, parent) {
   if (typeof index !== 'number' || !parent) return
-  parent.children.splice(index, 1)
+  parent.children.splice(index, 1, ...node.children)
   // Do not traverse `node`, continue at the node *now* at `index`.
   return [SKIP, index]
 })
```

Yields:

```js
{
  type: 'root',
  children: [
    {
      type: 'paragraph',
      children: [
        {type: 'text', value: 'Some text with '},
        {type: 'text', value: 'emphasis'},
        {type: 'text', value: '.'}
      ]
    },
    {
      type: 'paragraph',
      children: [
        {type: 'text', value: 'Another paragraph with '},
        {type: 'strong', children: [Array]},
        {type: 'text', value: ' (and '},
        {type: 'text', value: 'more emphasis'},
        {type: 'text', value: ').'}
      ]
    }
  ]
}
```

[tree-traversal]: /learn/recipe/tree-traversal/

[array]: https://developer.mozilla.org/docs/JavaScript/Reference/Global_Objects/Array

[splice]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice

[visit-parents]: https://github.com/syntax-tree/unist-util-visit-parents#visitparentstree-test-visitor-reverse
