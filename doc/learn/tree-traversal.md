---
authorGithub: wooorm
authorTwitter: wooorm
author: Titus Wormer
description: How to do tree traversal (also known as walking or visiting a tree)
group: recipe
index: 3
modified: 2024-08-02
published: 2019-12-23
tags:
  - traverse
  - tree
  - unist
  - visit
  - walk
title: Tree traversal
---

## How to walk a tree

### Contents

* [Tree traversal](#tree-traversal)
* [Set up](#set-up)
* [Traverse the tree](#traverse-the-tree)
* [Visiting a certain kind of node](#visiting-a-certain-kind-of-node)

### Tree traversal

**Tree traversal** is a common task when working with syntax trees.
The term *tree* here means a node and all its *descendants* (all the nodes
inside it).
Traversal means stopping at every node to do something.
So, tree traversal means doing something for every node in a tree.

Tree traversal is often also called “walking a tree”.
Or “visiting a tree”.

To learn more, continue reading, but when working with unist (unified’s trees)
you probably need either:

* [`unist-util-visit`][visit]
* [`unist-util-visit-parents`][visit-parents]

### Set up

Glad you’re still here!
Let’s say we have the following fragment of HTML, in a file `example.html`:

```html
<p>
  <!-- A comment. -->
  Some <strong>strong importance</strong>, <em>emphasis</em>, and a dash of
  <code>code</code>.
</p>
```

You could parse that with the following code (using [`unified`][unified] and
[`rehype-parse`][rehype-parse]):

```js twoslash
/// <reference types="node" />
// ---cut---
import fs from 'node:fs/promises'
import rehypeParse from 'rehype-parse'
import {unified} from 'unified'

const document = await fs.readFile('example.html')

const tree = unified().use(rehypeParse, {fragment: true}).parse(document)

console.log(tree)
```

Which would yield (ignoring positional info for brevity):

```js
{
  type: 'root',
  children: [
    {
      type: 'element',
      tagName: 'p',
      properties: {},
      children: [
        { type: 'text', value: '\n  ' },
        { type: 'comment', value: ' A comment. ' },
        { type: 'text', value: '\n  Some ' },
        {
          type: 'element',
          tagName: 'strong',
          properties: {},
          children: [ { type: 'text', value: 'strong importance' } ]
        },
        { type: 'text', value: ', ' },
        {
          type: 'element',
          tagName: 'em',
          properties: {},
          children: [ { type: 'text', value: 'emphasis' } ]
        },
        { type: 'text', value: ', and a dash of\n  ' },
        {
          type: 'element',
          tagName: 'code',
          properties: {},
          children: [ { type: 'text', value: 'code' } ]
        },
        { type: 'text', value: '.\n' }
      ]
    },
    { type: 'text', value: '\n' }
  ],
  data: { quirksMode: false }
}
```

As we are all set up, we can traverse the tree.

### Traverse the tree

A useful utility for that is [`unist-util-visit`][visit], and it works like so:

```js twoslash
/// <reference types="node" />
/**
 * @import {Root} from 'hast'
 */
const tree = /** @type {Root} */ (/** @type {unknown} */ (undefined))
// ---cut---
import {visit} from 'unist-util-visit'

// …

visit(tree, function (node) {
  console.log(node.type)
})
```

```txt
root
element
text
comment
text
element
text
text
element
text
text
element
text
text
text
```

We traversed the entire tree, and for each node, we printed its `type`.

### Visiting a certain kind of node

To “visit” only a certain `type` of node, pass a test to
[`unist-util-visit`][visit] like so:

```js twoslash
/// <reference types="node" />
/**
 * @import {Root} from 'hast'
 */
import {visit} from 'unist-util-visit'

const tree = /** @type {Root} */ (/** @type {unknown} */ (undefined))
// ---cut---
visit(tree, 'element', function (node) {
  console.log(node.tagName)
})
```

```txt
p
strong
em
code
```

You can do this yourself as well.
The above works the same as:

```js twoslash
/// <reference types="node" />
/**
 * @import {Root} from 'hast'
 */
import {visit} from 'unist-util-visit'

const tree = /** @type {Root} */ (/** @type {unknown} */ (undefined))
// ---cut---
visit(tree, function (node) {
  if (node.type === 'element') {
    console.log(node.tagName)
  }
})
```

But the test passed to `visit` can be more advanced, such as the following to
visit different kinds of nodes.

```js twoslash
/// <reference types="node" />
/**
 * @import {Root} from 'hast'
 */
import {visit} from 'unist-util-visit'

const tree = /** @type {Root} */ (/** @type {unknown} */ (undefined))
// @errors: 2339
// ---cut---
visit(tree, ['comment', 'text'], function (node) {
  console.log([node.value])
})
```

```txt
[ '\n  ' ]
[ ' A comment. ' ]
[ '\n  Some ' ]
[ 'strong importance' ]
[ ', ' ]
[ 'emphasis' ]
[ ', and a dash of\n  ' ]
[ 'code' ]
[ '.\n' ]
[ '\n' ]
```

Sadly,
TypeScript isn’t great with arrays and discriminated unions.
When you want to do more complex tests with TypeScript,
it’s recommended to omit the test and use explicit `if` statements:

```js twoslash
/// <reference types="node" />
/**
 * @import {Root} from 'hast'
 */
import {visit} from 'unist-util-visit'

const tree = /** @type {Root} */ (/** @type {unknown} */ (undefined))
// ---cut---
visit(tree, function (node) {
  if (node.type === 'comment' || node.type === 'text')  {
    console.log([node.value])
  }
})
```

Code that is more explicit and is understandable by TypeScript,
is often also easier to understand by humans.

Read more about [`unist-util-visit`][visit] in its readme.

[visit]: https://github.com/syntax-tree/unist-util-visit

[visit-parents]: https://github.com/syntax-tree/unist-util-visit-parents

[unified]: https://github.com/unifiedjs/unified

[rehype-parse]: https://github.com/rehypejs/rehype/tree/HEAD/packages/rehype-parse
