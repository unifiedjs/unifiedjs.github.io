---
group: recipe
index: 9
title: Tree traversal with TypeScript
description: How to do tree traversal in TypeScript
tags:
  - typescript
  - unist
  - tree
  - traverse
author: Christian Murphy
authorGithub: ChristianMurphy
published: 2020-06-09
modified: 2020-06-11
---

## Traversing trees with TypeScript

📓 Please read the
[introduction to tree traversal in JavaScript](/learn/recipe/tree-traversal/)
before reading this section.

A frequent task when working with unified is to traverse trees to find certain
nodes and then doing something with them (often validating or transforming
them).
Several type safe unified utilities can be used to help with this.

### `unist-util-visit`

[`unist-util-visit`](https://github.com/syntax-tree/unist-util-visit#readme)
takes a syntax tree, a `Test`, and a callback.
The callback is called for each node in the tree that passes `Test`.

For example if we want to increasing the heading level of all headings in a
markdown document:

```ts
import {remark} from 'remark'
import type {Root} from 'mdast'
import {visit} from 'unist-util-visit'

const markdownFile = await remark()
  .use(function () {
    return function (mdast: Root) {
      visit(
        mdast,
        // Check that the Node is a heading:
        'heading',
        function (node) {
          // The types know `node` is a heading.
          node.depth += 1
        }
      )
    }
  })
  .process('## Hello, *World*!')

console.log(markdownFile.toString())
```

Or if we want to make all ordered lists in a markdown document unordered:

```ts
import {remark} from 'remark'
import type {Root} from 'mdast'
import {visit} from 'unist-util-visit'

const markdownFile = await remark()
  .use(function () {
    return function (mdast: Root) {
      visit(
        mdast,
        // Check that the Node is a list:
        'list',
        function (node) {
          if (node.ordered) {
            // The types know `node` is an ordered list.
            node.ordered = false
          }
        }
      )
    }
  })
  .process('1. list item')

console.log(markdownFile.toString())
```

### `unist-util-visit-parents`

Sometimes it’s needed to know the ancestors of a node (all its parents).
[`unist-util-visit-parents`](https://github.com/syntax-tree/unist-util-visit-parents)
is like `unist-util-visit` but includes a list of all parent nodes.

For example if we want to check if all markdown `ListItem` are inside a `List`
we could:

```ts
import type {ListItem, Root} from 'mdast'
import remark from 'remark'
import {visitParents} from 'unist-util-visit-parents'

remark()
  .use(function () {
    return function (mdast: Root) {
      visitParents(mdast, 'listItem', function (listItem, parents) {
        // The types know `listItem` is a list item, and that `parents` are mdast
        // parents.
        if (
          !parents.some(function (parent) {
            return parent.type === 'list')
          }
        ) {
          console.warn('listItem is outside a list')
        }
      })
    }
  })
  .process('1. list item')
```

### `unist-util-select`

Sometimes CSS selectors are easier to read than several (nested) if/else
statements.
[`unist-util-select`](https://github.com/syntax-tree/unist-util-select) lets
you do that.
For example if we want to find all `Paragraph`s that are somewhere in a
`Blockquote`, we could:

```ts
import remark from 'remark'
import type {Root} from 'mdast'
import {selectAll} from 'unist-util-select'

remark()
  .use(function () {
    return function (mdast: Root) {
      const matches = selectAll('blockquote paragraph', mdast)
      console.log(matches)
    }
  })
  .process('1. list item')
```
