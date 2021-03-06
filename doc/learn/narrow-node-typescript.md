---
group: recipe
index: 10
title: Narrow nodes in TypeScript
description: How to narrow generic `Node` to specific syntax types
tags:
  - typescript
  - unist
  - node
author: Christian Murphy
authorGithub: ChristianMurphy
published: 2020-06-09
modified: 2020-06-15
---

## How to narrow `Node`s in TypeScript

To work with a specific node type or a set of node types we need to
[narrow][ts-narrow] their type.
For example, we can take a `Node` and do a type safe check to get a more
specific type like a `Link`.
unified provides a utility to help with this.
TypeScript also provides some language features that can help.
Let’s first take a look at `unist-util-is`.

[`unist-util-is`][unist-is] takes a `Node` and a `Test` and returns whether the
test passes.
It can be used as a [TypeScript type predicate][ts-predicate] which when used as
a condition (such as in an if-statement) tells TypeScript to narrow a node.

Here are some ways to narrow nodes:

```ts
import type {Node, Literal} from 'unist'
import type {List, Blockquote, Strong, Emphasis, Heading} from 'mdast'
import {is, convert} from 'unist-util-is'

// `Node` could come from a plugin, a utility, or be passed into a function
// here we hard code a Node for testing purposes
const node: Node = {type: 'example'}

if (is<List>(node, 'list')) {
  // If we’re here, node is List.
  //
  // `'list'` is compared to `node.type` to make sure they match.
  // `true` means a match, `false` means no match.
  //
  // `<List>` tells TypeScript to ensure `'list'` matches `List.type` and that
  // if `'list'` matches both `node.type` and `List.type`, we know that node is
  // `List` within this if condition.
}

if (is<Strong | Emphasis>(node, ['strong', 'emphasis'])) {
  // If we get here, node is `Strong` or `Emphasis`.

  // If we want even more specific type, we can use a discriminated union
  // <https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions>
  if (node.type === 'emphasis') {
    // If we get here, node is `Emphasis`.
  }
}

if (is<Heading>(node, {type: 'heading', depth: 1})) {
  // If we get here, node is `Heading`.
  //
  // TypeScript checks that the properties used in the `Test` are valid
  // attributes of `<Heading>`.
  //
  // It does not narrow `node.depth` only be 1, which can be done with
  // `<Heading & {depth: 1}>`.
}

// For advanced use cases, another predicate can be passed to `is`
if (is<Literal>(node, (node: Node): node is Literal => 'value' in node)) {
  // If we get here, node is one of the `Literal` types.
  //
  // Here any comparison function can be used, as long as it is a predicate
  // <https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates>
  // and as long as the predicate and generic match.
  // For example here, `<Literal>` and `is Literal` match.
}

// Reusable predicates can also be created using any `Test`
const isBlockquote = convert<Blockquote>('blockquote')
if (isBlockquote(node)) {
  // If we get here, node is `Blockquote`.
}
```

[unist-is]: https://github.com/syntax-tree/unist-util-is

[ts-narrow]: https://www.typescriptlang.org/docs/handbook/2/narrowing.html

[ts-predicate]: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
