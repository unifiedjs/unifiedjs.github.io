---
group: recipe
index: 9
title: Tree traversal with TypeScript
description: How to do tree traversal (also known as walking or visiting a tree)
tags:
  - unist
  - tree
  - traverse
  - walk
  - visit
author: Christian Murphy
authorGithub: ChristianMurphy
published: 2020-06-09
modified: 2020-06-11
---

## How to traverse a syntax tree

:notebook: please read the [introduction to tree traversal in JavaScript](./tree-traversal/)
before reading this section.

A frequent task when working with unified is to traverse trees to find certain
nodes and then doing something with them (often validating or transforming
them).
There are several type-safe utilities provided by unified to help with this.

### `unist-util-visit`

[`unist-util-visit`](https://github.com/syntax-tree/unist-util-visit#readme)
takes a syntax tree, a `Test`, and a callback.
The callback is called for each node in the tree that passes `Test`.

For example if we want to increasing the heading level of all headings in a
markdown document:

```ts
import remark from 'remark'
import type {Node} from 'unist'
import type {Heading} from 'mdast'
import {visit} from 'unist-util-visit'

const markdownFile = await remark()
  .use(() => (mdast: Node) => {
    visit(
      mdast,
      // Check that the Node is a heading:
      'heading',
      (node: Heading) => {
        node.depth += 1
      }
    )
  })
  .process('## Hello, *World*!')

console.log(markdownFile.toString())
```

Or if we want to make all ordered lists in a markdown document unordered:

```ts
import remark from 'remark'
import type {Node} from 'unist'
import type {List} from 'mdast'
import {visit} from 'unist-util-visit'

const markdownFile = await remark()
  .use(() => (mdast: Node) => {
    visit(
      mdast,
      // Check that the Node is a list and that it is ordered:
      {type: 'list', ordered: true},
      (node: List) => {
        node.ordered = false
      }
    )
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
import remark from 'remark'
import type {Node, Parent} from 'unist'
import type {ListItem} from 'mdast'
import {visitParents} from 'unist-util-visit-parents'

remark()
  .use(() => (mdast: Node) => {
    visitParents(mdast, 'listItem', (listItem: ListItem, parents: Parent[]) => {
      if (!parents.some((parent) => parent.type === 'list')) {
        console.warn('listItem is outside a list')
      }
    })
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
import type {Node} from 'unist'
import {selectAll} from 'unist-util-select'

remark()
  .use(() => (mdast: Node) => {
    const matches = selectAll('blockquote paragraph', mdast)
    console.log(matches)
  })
  .process('1. list item')
```
