---
authorGithub: ChristianMurphy
author: Christian Murphy
description: How to do tree traversal in TypeScript
group: recipe
index: 9
modified: 2024-08-05
published: 2020-06-09
tags:
  - traverse
  - tree
  - typescript
  - unist
title: Tree traversal with TypeScript
---

## Traversing trees with TypeScript

📓 Please read the
[introduction to tree traversal in JavaScript][tree-traversal]
before reading this section.

A frequent task when working with unified is to traverse trees to find certain
nodes and then doing something with them (often validating or transforming
them).
Several type safe unified utilities can be used to help with this.

### `unist-util-visit`

[`unist-util-visit`][visit] takes a syntax tree,
a `Test`,
and a callback.
The callback is called for each node in the tree that passes `Test`.

For example if we want to increasing the heading level of all headings in a
markdown document:

```ts twoslash
/// <reference types="node" />
// ---cut---
import type {Root} from 'mdast'
import {remark} from 'remark'
import {visit} from 'unist-util-visit'

const file = await remark()
  .use(function () {
    return function (tree: Root) {
      // Check that the Node is a heading:
      visit(tree, 'heading', function (node) {
        // The types know `node` is a heading.
        node.depth += 1
      })
    }
  })
  .process('## Hello, *World*!')

console.log(String(file))
```

Or if we want to make all ordered lists in a markdown document unordered:

```ts twoslash
/// <reference types="node" />
// ---cut---
import type {Root} from 'mdast'
import {remark} from 'remark'
import {visit} from 'unist-util-visit'

const file = await remark()
  .use(function () {
    return function (tree: Root) {
      // Check that the Node is a list:
      visit(tree, 'list', function (node) {
        if (node.ordered) {
          // The types know `node` is an ordered list.
          node.ordered = false
        }
      })
    }
  })
  .process('1. list item')

console.log(String(file))
```

As always with TypeScript,
make sure that the input values are typed correctly.

### `unist-util-visit-parents`

Sometimes it’s needed to know the ancestors of a node (all its parents).
[`unist-util-visit-parents`][visit-parents] is like `unist-util-visit` but
includes a list of all parent nodes.

For example if we want to check if `code` is in a `pre`, at any depth,
we could:

```ts twoslash
/// <reference types="node" />
// ---cut---
import type {Root} from 'hast'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import {unified} from 'unified'
import {visitParents} from 'unist-util-visit-parents'

const file = await unified()
  .use(rehypeParse, {fragment: true})
  .use(function () {
    return function (tree: Root) {
      visitParents(tree, 'element', function (node, parents) {
        if (
          node.tagName === 'code' &&
          parents.some(function (parent) {
            return parent.type === 'element' && parent.tagName === 'pre'
          })
        ) {
          console.log('`<code>` in `<pre>`')
        }
      })
    }
  })
  .use(rehypeStringify)
  .process(
    "<pre><code>console.log('hi!')</code></pre><p><code>hello!</code></p>"
  )
```

### `unist-util-select`

Sometimes CSS selectors are easier to read than several (nested) if/else
statements.
[`unist-util-select`][select] lets you do that.
For example if we want to find all `Paragraph`s that are somewhere in a
`Blockquote`, we could:

```ts twoslash
/// <reference types="node" />
// ---cut---
import type {Paragraph, Root} from 'mdast'
import {remark} from 'remark'
import {selectAll} from 'unist-util-select'

remark()
  .use(function () {
    return function (mdast: Root) {
      const matches = selectAll('blockquote paragraph', mdast) as Paragraph[]
      console.log(matches)
    }
  })
  .process('> block quote')
```

[tree-traversal]: /learn/recipe/tree-traversal/

[visit]: https://github.com/syntax-tree/unist-util-visit

[visit-parents]: https://github.com/syntax-tree/unist-util-visit-parents

[select]: https://github.com/syntax-tree/unist-util-select
