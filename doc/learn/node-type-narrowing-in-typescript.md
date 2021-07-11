---
group: recipe
index: 3
title: Tree traversal
description: How to do tree traversal (also known as walking or visiting a tree)
tags:
  - typescript
  - unist
  - mdast
author: Christian Murphy
authorGithub: ChristianMurphy
published: 2020-06-09
modified: 2020-06-11
---

## How to narrow generic `Node` to specific syntax types

To work with a specific node type or a set of node types we need to
[narrow](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) their
type.
For example, we can take a `Node` and perform a type safe check to get a more
specific type like a `Link`.
Unified provides a utility to help with this and there are some TypeScript
language features which can also help.
Let’s first take a look at `unist-util-is`.

[`unist-util-is`](https://github.com/syntax-tree/unist-util-is#readme) takes a
`Node` and a [`Test`](https://github.com/syntax-tree/unist-util-is#isnode-test-index-parent-context)
and returns `true` if the test passes, and `false` if it does not. It also is
a [TypeScript predicate](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
meaning if used as the condition for an `if` statement, TypeScript knows more
about the type inside the `if`.

For example:

```ts
import type {Node, Literal} from 'unist'
import type {List, Blockquote, Strong, Emphasis, Heading} from 'mdast'
import {is, convert} from 'unist-util-is'

// `Node` could come from a plugin, a utility, or be passed into a function
// here we hard code a Node for testing purposes
const node: Node = {type: 'example'}

if (is<List>(node, 'list')) {
  // If we get here, node is List
}

if (is<Strong | Emphasis>(node, ['strong', 'emphasis'])) {
  // If we get here, node is Strong or Emphasis

  // If we want even more specific type, we can use a discriminated union
  // https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions
  if (node.type === 'emphasis') {
    // If we get here, node is Emphasis
  }
}

if (is<Heading>(node, {type: 'heading', depth: 1})) {
  // If we get here, node is Heading
}

// For advanced use cases, another predicate can be passed to `is`
if (is<Literal>(node, (node: Node): node is Literal => 'value' in node)) {
  // If we get here, node is one of the Literal types
}

// Reusable predicates can also be created using any `Test`
const isBlockquote = convert<Blockquote>('blockquote')
if (isBlockquote(node)) {
  // If we get here, node is Blockquote
}
```
